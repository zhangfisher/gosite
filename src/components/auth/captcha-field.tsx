"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface CaptchaValue {
	token: string;
	code: string;
}

/**
 * 图片验证码输入组件（受控）
 *
 * 挂载时向 /api/auth/captcha 请求一张 SVG 验证码，返回 token 与 svg。
 * 用户输入的字符通过 onChange 回传给父组件，父组件提交时携带
 * x-captcha-token / x-captcha-code 请求头。
 */
export function CaptchaField({
	value,
	onChange,
}: {
	value: CaptchaValue;
	onChange: (value: CaptchaValue) => void;
}) {
	const [svg, setSvg] = useState("");
	const [token, setToken] = useState(value.token);

	async function load() {
		try {
			const res = await fetch("/api/auth/captcha");
			const data = await res.json();
			setToken(data.token);
			setSvg(data.svg);
			onChange({ token: data.token, code: "" });
		} catch {
			// 忽略加载失败，由用户点击刷新重试
		}
	}

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor="captcha" className="text-sm font-medium">
				验证码
			</label>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={load}
					aria-label="刷新验证码"
					className="h-9 overflow-hidden rounded-md border border-border bg-muted"
					dangerouslySetInnerHTML={{ __html: svg }}
				/>
				<Button type="button" variant="outline" size="sm" onClick={load}>
				刷新
				</Button>
			</div>
			<Input
				id="captcha"
				type="text"
				autoComplete="off"
				required
				placeholder="请输入图片中的字符"
				maxLength={6}
				value={value.code}
				onChange={(e) => onChange({ token, code: e.target.value })}
			/>
		</div>
	);
}
