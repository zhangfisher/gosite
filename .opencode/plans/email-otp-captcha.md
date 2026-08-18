# 实施方案：为 better-auth 引入 email-otp 与自建图片验证码

## 背景与决策（已与用户确认）

- **email-otp 插件**：启用「OTP 登录」+「OTP 重置密码」两个流程（用户引用文档锚点 reset-password-with-otp）。
- **captcha**：better-auth 官方 `captcha` 插件只封装第三方服务，**不支持内置图片验证码**。用户选择**自建图片验证码**（用 `svg-captcha` 生成 SVG，答案存 `verification` 表，通过 better-auth `onRequest` 在目标端点拦截校验）。
- **邮件**：使用 **Resend** 真实发信，配置放 `.env`。
- **注册页**：开放（普通密码注册仍开放）；`emailOTP({ disableSignUp: true })` 仅限制 OTP 登录不为陌生邮箱自动建号。
- **数据库**：email-otp 与验证码均复用现有 `verification` 表（camelCase 字段），**无需 drizzle 迁移**。

## 涉及文件

### 1. `src/lib/email.ts`（新建）
Resend 封装 `sendEmail({ to, subject, text, html })`，未配置 `RESEND_API_KEY` 时降级为控制台打印（不阻断流程）。

```ts
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface SendEmailOptions { to: string; subject: string; text: string; html?: string; }

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY 未配置，邮件未真正发送 → ${to}\n  主题: ${subject}\n  内容: ${text}`);
    return;
  }
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "no-reply@example.com",
    to, subject, text, html: html ?? `<p>${text}</p>`,
  });
  if (error) { console.error(`[email] 发送失败 → ${to}:`, error); throw new Error(`邮件发送失败: ${error.message}`); }
}
```

### 2. `src/lib/auth/captcha-plugin.ts`（新建）
自建 better-auth 插件 `captchaPlugin({ endpoints? })`：
- 暴露端点 `GET /api/auth/captcha`：`svg-captcha.create({ size:5, ignoreChars:"0o1iIl", noise:2, color:true })` 生成 SVG，把答案写入 `verification`（`identifier:"captcha:<token>"`, `value: text`, `expiresAt: now+5min`），返回 `{ token, svg }`。
- `onRequest(request, ctx)`：对受保护路径，从请求头 `x-captcha-token` / `x-captcha-code` 读取并校验；缺失→400 `CAPTCHA_REQUIRED`；不匹配/过期→400 `INVALID_CAPTCHA`；通过则删除该验证码条目后放行。直接读请求头，不消费 body，避免破坏下游解析。

受保护路径默认值（覆盖登录+注册+找回密码全链路）：
`/sign-in/email`, `/sign-in/email-otp`, `/email-otp/send-verification-otp`,
`/sign-up/email`, `/email-otp/request-password-reset`, `/email-otp/reset-password`。

```ts
import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import { nanoid } from "nanoid";
import svgCaptcha from "svg-captcha";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { verification } from "@/db/schema";

const CAPTCHA_TTL = 60 * 5; // 5 分钟

function normalize(pathname: string, basePath: string) {
  let p = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  p = p.replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

function captchaError(message: string) {
  return {
    response: new Response(JSON.stringify({ message, code: message }),
      { status: 400, headers: { "content-type": "application/json" } }),
  };
}

export const captchaPlugin = (options?: { endpoints?: string[] }): BetterAuthPlugin => {
  const endpoints = options?.endpoints ?? [
    "/sign-in/email", "/sign-in/email-otp", "/email-otp/send-verification-otp",
    "/sign-up/email", "/email-otp/request-password-reset", "/email-otp/reset-password",
  ];
  return {
    id: "custom-captcha",
    endpoints: {
      getCaptcha: createAuthEndpoint("/captcha", { method: "GET" } as const, async (ctx) => {
        const c = svgCaptcha.create({ size: 5, ignoreChars: "0o1iIl", noise: 2, color: true, background: "#f2f2f2" });
        const token = nanoid();
        await db.insert(verification).values({
          id: nanoid(),
          identifier: `captcha:${token}`,
          value: c.text,
          expiresAt: new Date(Date.now() + CAPTCHA_TTL * 1000),
        });
        return ctx.json({ token, svg: c.data });
      }),
    },
    onRequest: async (request: Request, ctx) => {
      const url = new URL(request.url);
      const basePath = ctx.options.basePath ?? "/api/auth";
      const path = normalize(url.pathname, basePath);
      if (!endpoints.includes(path)) return;
      const token = request.headers.get("x-captcha-token");
      const code = request.headers.get("x-captcha-code");
      if (!token || !code) return captchaError("CAPTCHA_REQUIRED");
      const [record] = await db.select().from(verification).where(eq(verification.identifier, `captcha:${token}`));
      if (!record || record.expiresAt.getTime() < Date.now() || record.value.toLowerCase() !== code.toLowerCase()) {
        if (record) await db.delete(verification).where(eq(verification.identifier, `captcha:${token}`));
        return captchaError("INVALID_CAPTCHA");
      }
      await db.delete(verification).where(eq(verification.identifier, `captcha:${token}`));
      return;
    },
  };
};
```

### 3. `src/lib/auth.ts`（修改）
导入 `emailOTP` 与 `captchaPlugin`、`sendEmail`；插件数组加入并配置 `sendVerificationOTP`：

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, admin, emailOTP } from "better-auth/plugins";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { captchaPlugin } from "@/lib/auth/captcha-plugin";

const sendVerificationOTP = async ({ email, otp, type }: { email: string; otp: string; type: "sign-in" | "email-verification" | "forget-password" | "change-email" }) => {
  const map = {
    "sign-in": { subject: "登录验证码", text: `您的登录验证码是 ${otp}，5 分钟内有效。` },
    "forget-password": { subject: "重置密码验证码", text: `您的重置密码验证码是 ${otp}，5 分钟内有效。` },
    "email-verification": { subject: "邮箱验证码", text: `您的验证码是 ${otp}，5 分钟内有效。` },
    "change-email": { subject: "改绑邮箱验证码", text: `您的验证码是 ${otp}，5 分钟内有效。` },
  } as const;
  const { subject, text } = map[type];
  await sendEmail({ to: email, subject, text });
};

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", usePlural: false, schema: { user, session, account, verification } }),
  emailAndPassword: { enabled: true },
  plugins: [
    username({ displayUsername: false }),
    admin({ defaultRole: "user" }),
    emailOTP({ sendVerificationOTP, disableSignUp: true }),
    captchaPlugin(),
  ],
  session: { expiresIn: 60 * 60 * 24 * 7, cookieCache: { enabled: true, maxAge: 60 * 5 } },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});

export async function getSession(headers: Headers) {
  return auth.api.getSession({ headers });
}
```

### 4. `src/lib/auth-client.ts`（修改）
加入 `emailOTPClient()`（来自 `better-auth/client/plugins`）：

```ts
import { createAuthClient } from "better-auth/react";
import { username } from "better-auth/plugins";
import { adminClient, emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [username({ displayUsername: false }), adminClient(), emailOTPClient()],
});

export const { signIn, signUp, signOut } = authClient;
```

### 5. `src/components/auth/captcha-field.tsx`（新建）
受控组件 `CaptchaField({ value: {token,code}, onChange })`：挂载时 `fetch('/api/auth/captcha')` 取 SVG+token，渲染图片（点击刷新），输入字符回传 `onChange({ token, code })`。

### 6. `src/components/auth/login-form.tsx`（改造）
- 新增「验证码登录」模式开关：
  - OTP 模式：`email` → `authClient.emailOtp.sendVerificationOtp({ email, type:"sign-in" }, { headers })` 获取验证码 → 输入 OTP → `authClient.signIn.emailOtp({ email, otp }, { headers })`。
  - 密码模式：保持现状（email/username 自动识别），提交时同样带 `headers`。
- 两种模式均内嵌 `CaptchaField`，提交时把 `x-captcha-token` / `x-captcha-code` 放进 `fetchOptions.headers`。
- 底部增加「忘记密码？」链接 → `/forgot-password`。

### 7. 忘记密码 `src/app/forgot-password/page.tsx` + `src/components/auth/forgot-password-form.tsx`（新建）
两步：
1. 邮箱 + 验证码 → `authClient.emailOtp.requestPasswordReset({ email }, { headers })`。
2. OTP + 新密码 + 验证码 → `authClient.emailOtp.resetPassword({ email, otp, password }, { headers })`。
（即文档 reset-password-with-otp 流程）

### 8. 注册 `src/app/register/page.tsx` + `src/components/auth/register-form.tsx`（新建）
- 字段：用户名、邮箱、密码、确认密码、验证码。
- 提交：`authClient.signUp.email({ email, password, name }, { headers })`（username 插件要求 username 字段，随表单提交）。

### 9. `.env` / `.env.example`
`.env` 追加：`RESEND_API_KEY=`、`EMAIL_FROM=`。新建 `.env.example` 同步（含 `BETTER_AUTH_*` 与新增项）。

### 10. 依赖（已完成）
`bun add resend svg-captcha` → resend@6.20.0、svg-captcha@1.4.0。

## 校验步骤
1. `bun run build`（含类型检查）或 `bunx tsc --noEmit`。
2. `bun run dev` 本地验证：
   - 密码登录（带验证码）成功；错误验证码返回 400 `INVALID_CAPTCHA`。
   - OTP 登录：收信→输入→登录。
   - 忘记密码：收 OTP→重置密码。
   - 注册：带验证码注册成功。
3. 确认 `verification` 表无新增迁移需求（`db:push` 无需改动）。

## 风险与备注
- `svg-captcha` 为纯 JS，Bun 兼容；若运行期异常，可替换为手写 SVG 生成。
- captcha 校验读请求头而非 body，与 better-auth 官方 `captcha` 插件一致，避免消费 body。
- OTP 登录 `disableSignUp:true` 仅限已注册邮箱；如需允许 OTP 自动注册则改为 `false`。
