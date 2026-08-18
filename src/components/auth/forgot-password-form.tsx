"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CaptchaField, type CaptchaValue } from "@/components/auth/captcha-field";

/**
 * 忘记密码（OTP 重置密码流程）
 *
 * 步骤一：输入邮箱 + 验证码 → 请求发送重置验证码邮件
 * 步骤二：输入邮件中的 OTP + 新密码 + 验证码 → 重置密码
 * 两个步骤均受自建 captcha 插件保护。
 */
export function ForgotPasswordForm() {
	const router = useRouter();
	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [captcha, setCaptcha] = useState<CaptchaValue>({ token: "", code: "" });
	const [error, setError] = useState<string | null>(null);
	const [ok, setOk] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const captchaHeaders = {
		"x-captcha-token": captcha.token,
		"x-captcha-code": captcha.code,
	};

	async function handleRequest(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setOk(null);
		setLoading(true);
		const { error } = await authClient.emailOtp.requestPasswordReset(
			{ email },
			{ headers: captchaHeaders },
		);
		setLoading(false);
		if (error) {
			setError(error.message ?? "验证码邮件发送失败");
			setCaptcha({ token: "", code: "" });
		} else {
			setOk("验证码已发送至您的邮箱（有效期 5 分钟）");
			setStep(2);
		}
	}

	async function handleReset(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setOk(null);
		setLoading(true);
		const { error } = await authClient.emailOtp.resetPassword(
			{ email, otp, password },
			{ headers: captchaHeaders },
		);
		setLoading(false);
		if (error) {
			setError(error.message ?? "重置失败，请检查验证码");
			setCaptcha({ token: "", code: "" });
		} else {
			setOk("密码已重置，正在跳转到登录页…");
			setTimeout(() => router.push("/login"), 1200);
		}
	}

	return (
		<div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
			<div className="mb-6 text-center">
				<h1 className="text-lg font-semibold">忘记密码</h1>
			</div>

			{step === 1 ? (
				<form onSubmit={handleRequest} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="email" className="text-sm font-medium">
							邮箱
						</label>
						<Input
							id="email"
							type="email"
							required
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<CaptchaField value={captcha} onChange={setCaptcha} />
					{error ? (
						<p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
							{error}
						</p>
					) : null}
					{ok ? (
						<p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
							{ok}
						</p>
					) : null}
					<Button type="submit" disabled={loading} className="mt-2 w-full">
						{loading ? "发送中…" : "发送验证码"}
					</Button>
				</form>
			) : (
				<form onSubmit={handleReset} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="otp" className="text-sm font-medium">
							邮箱验证码
						</label>
						<Input
							id="otp"
							type="text"
							required
							placeholder="邮箱中的 6 位验证码"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label htmlFor="password" className="text-sm font-medium">
							新密码
						</label>
						<Input
							id="password"
							type="password"
							required
							placeholder="至少 8 位"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<CaptchaField value={captcha} onChange={setCaptcha} />
					{error ? (
						<p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
							{error}
						</p>
					) : null}
					{ok ? (
						<p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
							{ok}
						</p>
					) : null}
					<Button type="submit" disabled={loading} className="mt-2 w-full">
						{loading ? "重置中…" : "重置密码"}
					</Button>
				</form>
			)}
		</div>
	);
}
