"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CaptchaField, type CaptchaValue } from "@/components/auth/captcha-field";

/**
 * 注册表单（普通密码注册，开放注册）
 *
 * 受自建 captcha 插件保护（/sign-up/email 端点）。
 * username 插件要求注册时提供 username 字段。
 */
export function RegisterForm() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [captcha, setCaptcha] = useState<CaptchaValue>({ token: "", code: "" });
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const captchaHeaders = {
		"x-captcha-token": captcha.token,
		"x-captcha-code": captcha.code,
	};

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		if (password !== confirm) {
			setError("两次输入的密码不一致");
			return;
		}
		setLoading(true);
		const { error } = await authClient.signUp.email(
			{ email, password, name: username, username },
			{ headers: captchaHeaders },
		);
		setLoading(false);
		if (error) {
			setError(error.message ?? "注册失败，请检查信息或验证码");
			setCaptcha({ token: "", code: "" });
		} else {
			router.push("/login");
		}
	}

	return (
		<div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
			<div className="mb-6 text-center">
				<h1 className="text-lg font-semibold">注册</h1>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<label htmlFor="username" className="text-sm font-medium">
						用户名
					</label>
					<Input
						id="username"
						type="text"
						required
						placeholder="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
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
				<div className="flex flex-col gap-1.5">
					<label htmlFor="password" className="text-sm font-medium">
						密码
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
				<div className="flex flex-col gap-1.5">
					<label htmlFor="confirm" className="text-sm font-medium">
						确认密码
					</label>
					<Input
						id="confirm"
						type="password"
						required
						placeholder="再次输入密码"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
					/>
				</div>
				<CaptchaField value={captcha} onChange={setCaptcha} />
				{error ? (
					<p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
						{error}
					</p>
				) : null}
				<Button type="submit" disabled={loading} className="mt-2 w-full">
					{loading ? "注册中…" : "注册"}
				</Button>
			</form>
			<div className="mt-4 text-center">
				<Link href="/login" className="text-sm text-primary hover:underline">
					已有账号？去登录
				</Link>
			</div>
		</div>
	);
}
