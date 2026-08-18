import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
	? new Resend(process.env.RESEND_API_KEY)
	: null;

export interface SendEmailOptions {
	to: string;
	subject: string;
	text: string;
	html?: string;
}

/**
 * 通过 Resend 发送邮件。
 *
 * 未配置 RESEND_API_KEY 时降级为控制台打印，便于本地调试而不阻断流程。
 * 真实环境需在 .env 设置 RESEND_API_KEY 与 EMAIL_FROM（已验证的发信域名）。
 */
export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
	if (!resend) {
		console.warn(
			`[email] RESEND_API_KEY 未配置，邮件未真正发送 → ${to}\n  主题: ${subject}\n  内容: ${text}`,
		);
		return;
	}
	const { error } = await resend.emails.send({
		from: process.env.EMAIL_FROM ?? "no-reply@example.com",
		to,
		subject,
		text,
		html: html ?? `<p>${text}</p>`,
	});
	if (error) {
		console.error(`[email] 发送失败 → ${to}:`, error);
		throw new Error(`邮件发送失败: ${error.message}`);
	}
}
