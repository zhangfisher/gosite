"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CaptchaField, type CaptchaValue } from "@/components/auth/captcha-field";

/**
 * 登录表单
 *
 * 支持两种模式：
 * - 密码模式：邮箱/用户名 + 密码（signIn.email / signIn.username 自动识别）
 * - 验证码模式：邮箱 → 获取 OTP → 输入 OTP 登录（email-otp 插件）
 *
 * 两种模式均需通过图片验证码（自建 captcha 插件），验证码随请求头提交。
 */
export function LoginForm({ redirectTo }: { redirectTo: string }) {
	const [mode, setMode] = useState<"password" | "otp">("password");
	const [account, setAccount] = useState("admin");
	const [password, setPassword] = useState("22182666@hyt");
	const [otp, setOtp] = useState("");
	const [captcha, setCaptcha] = useState<CaptchaValue>({ token: "", code: "" });
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [otpSent, setOtpSent] = useState(false);

	const captchaHeaders = {
		"x-captcha-token": captcha.token,
		"x-captcha-code": captcha.code,
	};

	async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const isEmail = account.includes("@");
		const { error } = isEmail
			? await signIn.email(
					{ email: account, password, callbackURL: redirectTo },
					{ headers: captchaHeaders },
				)
			: await signIn.username(
					{ username: account, password, callbackURL: redirectTo },
					{ headers: captchaHeaders },
				);
		setLoading(false);
		if (error) {
			setError(error.message ?? "登录失败，请检查账号与密码或验证码");
			setCaptcha({ token: "", code: "" });
		}
	}

	async function handleSendOtp() {
		setError(null);
		if (!account.includes("@")) {
			setError("验证码登录请使用邮箱");
			return;
		}
		setLoading(true);
		const { error } = await authClient.emailOtp.sendVerificationOtp(
			{ email: account, type: "sign-in" },
			{ headers: captchaHeaders },
		);
		setLoading(false);
		if (error) {
			setError(error.message ?? "验证码发送失败");
			setCaptcha({ token: "", code: "" });
		} else {
			setOtpSent(true);
		}
	}

	async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const { error } = await signIn.emailOtp(
			{ email: account, otp, callbackURL: redirectTo },
			{ headers: captchaHeaders },
		);
		setLoading(false);
		if (error) {
			setError(error.message ?? "登录失败，请检查验证码");
			setCaptcha({ token: "", code: "" });
		}
	}

	return (
		<div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
			<div className="mb-6 text-center">
				<h1 className="text-lg font-semibold">登录</h1>
			</div>

			<div className="mb-4 flex gap-2">
				<Button
					type="button"
					variant={mode === "password" ? "default" : "outline"}
					size="sm"
					onClick={() => setMode("password")}
				>
					密码登录
				</Button>
				<Button
					type="button"
					variant={mode === "otp" ? "default" : "outline"}
					size="sm"
					onClick={() => setMode("otp")}
				>
					验证码登录
				</Button>
			</div>

			{mode === "password" ? (
				<form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="account" className="text-sm font-medium">
							用户名 / 邮箱
						</label>
						<Input
							id="account"
							type="text"
							autoComplete="username"
							required
							placeholder="Account"
							value={account}
							onChange={(e) => setAccount(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label htmlFor="password" className="text-sm font-medium">
							密码
						</label>
						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							required
							placeholder="Password"
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
					<Button type="submit" disabled={loading} className="mt-2 w-full">
						{loading ? "登录中…" : "登录"}
					</Button>
				</form>
			) : (
				<form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="otp-account" className="text-sm font-medium">
							邮箱
						</label>
						<Input
							id="otp-account"
							type="email"
							autoComplete="username"
							required
							placeholder="you@example.com"
							value={account}
							onChange={(e) => setAccount(e.target.value)}
						/>
					</div>
					<CaptchaField value={captcha} onChange={setCaptcha} />
					{!otpSent ? (
						<Button
							type="button"
							disabled={loading}
							className="w-full"
							onClick={handleSendOtp}
						>
							{loading ? "发送中…" : "获取验证码"}
						</Button>
					) : (
						<div className="flex flex-col gap-1.5">
							<label htmlFor="otp" className="text-sm font-medium">
								验证码
							</label>
							<Input
								id="otp"
								type="text"
								required
								placeholder="邮箱收到的 6 位验证码"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
							/>
						</div>
					)}
					{error ? (
						<p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
							{error}
						</p>
					) : null}
					{otpSent ? (
						<Button type="submit" disabled={loading} className="mt-2 w-full">
							{loading ? "登录中…" : "登录"}
						</Button>
					) : null}
				</form>
			)}

			<div className="mt-4 text-center">
				<Link href="/forgot-password" className="text-sm text-primary hover:underline">
					忘记密码？
				</Link>
			</div>
		</div>
	);
}
