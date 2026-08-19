"use client";

import * as React from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function GeneralSettingsPage() {
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user;

	const [profile, setProfile] = React.useState({
		name: "",
		username: "",
		email: "",
		image: "",
	});
	const [profileSaving, setProfileSaving] = React.useState(false);

	const [pwd, setPwd] = React.useState({
		currentPassword: "",
		newPassword: "",
		confirm: "",
	});
	const [pwdSaving, setPwdSaving] = React.useState(false);

	React.useEffect(() => {
		if (user) {
			setProfile({
				name: user.name ?? "",
				username: (user as { username?: string }).username ?? "",
				email: user.email ?? "",
				image: user.image ?? "",
			});
		}
	}, [user]);

	function updateProfile<K extends keyof typeof profile>(
		key: K,
		value: (typeof profile)[K],
	) {
		setProfile((prev) => ({ ...prev, [key]: value }));
	}

	async function handleProfileSubmit(e: React.FormEvent) {
		e.preventDefault();
		setProfileSaving(true);
		try {
			const { error } = await authClient.updateUser({
				name: profile.name,
				username: profile.username,
				email: profile.email,
				image: profile.image || undefined,
			} as any);
			if (error) throw new Error(error.message);
			toast.success("个人资料已更新");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "更新失败");
		} finally {
			setProfileSaving(false);
		}
	}

	function updatePwd<K extends keyof typeof pwd>(
		key: K,
		value: (typeof pwd)[K],
	) {
		setPwd((prev) => ({ ...prev, [key]: value }));
	}

	async function handlePwdSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (pwd.newPassword !== pwd.confirm) {
			toast.error("两次输入的新密码不一致");
			return;
		}
		setPwdSaving(true);
		try {
			const { error } = await authClient.changePassword({
				currentPassword: pwd.currentPassword,
				newPassword: pwd.newPassword,
				revokeOtherSessions: true,
			});
			if (error) throw new Error(error.message);
			toast.success("密码已修改");
			setPwd({ currentPassword: "", newPassword: "", confirm: "" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "修改失败");
		} finally {
			setPwdSaving(false);
		}
	}

	if (isPending || !user) {
		return (
			<div className="mx-auto max-w-2xl py-10 text-center text-sm text-muted-foreground">
				加载中…
			</div>
		);
	}

	return (
		<div className="mx-auto grid max-w-2xl gap-4">
			<Card>
				<form onSubmit={handleProfileSubmit}>
					<CardHeader>
						<CardTitle>个人资料</CardTitle>
						<CardDescription>
							编辑当前登录管理员的基本信息。
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">名称</Label>
							<Input
								id="name"
								value={profile.name}
								onValueChange={(v) => updateProfile("name", v)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="username">用户名</Label>
							<Input
								id="username"
								value={profile.username}
								onValueChange={(v) => updateProfile("username", v)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">邮箱</Label>
							<Input
								id="email"
								type="email"
								value={profile.email}
								onValueChange={(v) => updateProfile("email", v)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="image">头像地址</Label>
							<Input
								id="image"
								value={profile.image}
								onValueChange={(v) => updateProfile("image", v)}
								placeholder="https://..."
							/>
						</div>
					</CardContent>
					<CardFooter className="justify-end">
						<Button type="submit" disabled={profileSaving}>
							{profileSaving ? "保存中…" : "保存资料"}
						</Button>
					</CardFooter>
				</form>
			</Card>

			<Card>
				<form onSubmit={handlePwdSubmit}>
					<CardHeader>
						<CardTitle>修改密码</CardTitle>
						<CardDescription>修改当前账户的登录密码。</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="currentPassword">当前密码</Label>
							<Input
								id="currentPassword"
								type="password"
								value={pwd.currentPassword}
								onValueChange={(v) => updatePwd("currentPassword", v)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="newPassword">新密码</Label>
							<Input
								id="newPassword"
								type="password"
								value={pwd.newPassword}
								onValueChange={(v) => updatePwd("newPassword", v)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="confirm">确认新密码</Label>
							<Input
								id="confirm"
								type="password"
								value={pwd.confirm}
								onValueChange={(v) => updatePwd("confirm", v)}
							/>
						</div>
					</CardContent>
					<CardFooter className="justify-end">
						<Button type="submit" disabled={pwdSaving}>
							{pwdSaving ? "保存中…" : "修改密码"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
