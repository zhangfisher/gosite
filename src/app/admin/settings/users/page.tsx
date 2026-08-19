"use client";

import * as React from "react";
import {
	Ban,
	CheckCircle2,
	KeyRound,
	Plus,
	Trash2,
	UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ManagedUser {
	id: string;
	name: string;
	email: string;
	username: string;
	role: string;
	banned: boolean;
	createdAt: string | number;
}

const PAGE_SIZE = 10;

export default function UsersSettingsPage() {
	const [users, setUsers] = React.useState<ManagedUser[]>([]);
	const [total, setTotal] = React.useState(0);
	const [offset, setOffset] = React.useState(0);
	const [loading, setLoading] = React.useState(true);

	const [createOpen, setCreateOpen] = React.useState(false);
	const [creating, setCreating] = React.useState(false);
	const [createForm, setCreateForm] = React.useState({
		name: "",
		email: "",
		username: "",
		password: "",
		role: "user",
	});

	const [resetTarget, setResetTarget] = React.useState<ManagedUser | null>(null);
	const [resetPwd, setResetPwd] = React.useState("");
	const [resetting, setResetting] = React.useState(false);

	async function load() {
		setLoading(true);
		try {
			const { data, error } = await authClient.admin.listUsers({
				query: { limit: PAGE_SIZE, offset },
			});
			if (error) throw new Error(error.message);
			setUsers((data?.users as unknown as ManagedUser[]) ?? []);
			setTotal(data?.total ?? 0);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "加载用户失败");
		} finally {
			setLoading(false);
		}
	}

	React.useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [offset]);

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		setCreating(true);
		try {
			const { error } = await authClient.admin.createUser({
				name: createForm.name,
				email: createForm.email,
				username: createForm.username,
				password: createForm.password,
				role: createForm.role as "user" | "admin",
			} as any);
			if (error) throw new Error(error.message);
			toast.success("用户已创建");
			setCreateOpen(false);
			setCreateForm({
				name: "",
				email: "",
				username: "",
				password: "",
				role: "user",
			});
			load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "创建失败");
		} finally {
			setCreating(false);
		}
	}

	async function handleToggleBan(user: ManagedUser) {
		try {
			if (user.banned) {
				const { error } = await authClient.admin.unbanUser({
					userId: user.id,
				});
				if (error) throw new Error(error.message);
				toast.success("已启用用户");
			} else {
				const { error } = await authClient.admin.banUser({
					userId: user.id,
					banReason: "由管理员禁用",
				});
				if (error) throw new Error(error.message);
				toast.success("已禁用用户");
			}
			load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "操作失败");
		}
	}

	async function handleResetPassword() {
		if (!resetTarget) return;
		if (!resetPwd) {
			toast.error("请输入新密码");
			return;
		}
		setResetting(true);
		try {
			const { error } = await (
				authClient.admin as unknown as {
					setPassword: (input: {
						userId: string;
						newPassword: string;
					}) => Promise<{ error: { message?: string } | null }>;
				}
			).setPassword({
				userId: resetTarget.id,
				newPassword: resetPwd,
			});
			if (error) throw new Error(error.message);
			toast.success("密码已重置");
			setResetTarget(null);
			setResetPwd("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "重置失败");
		} finally {
			setResetting(false);
		}
	}

	async function handleRemove(user: ManagedUser) {
		if (!confirm(`确定删除用户 ${user.email} 吗？此操作不可恢复。`)) return;
		try {
			const { error } = await authClient.admin.removeUser({
				userId: user.id,
			});
			if (error) throw new Error(error.message);
			toast.success("用户已删除");
			load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "删除失败");
		}
	}

	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

	return (
		<div className="mx-auto max-w-4xl">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h2 className="text-lg font-medium">用户管理</h2>
					<p className="text-sm text-muted-foreground">
						创建用户、重置密码、启用 / 禁用账户。
					</p>
				</div>
				<Button onClick={() => setCreateOpen(true)}>
					<UserPlus className="size-4" />
					新增用户
				</Button>
			</div>

			<div className="overflow-hidden rounded-xl border border-border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>名称</TableHead>
							<TableHead>邮箱</TableHead>
							<TableHead>用户名</TableHead>
							<TableHead>角色</TableHead>
							<TableHead>状态</TableHead>
							<TableHead className="text-right">操作</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
									加载中…
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
									暂无用户
								</TableCell>
							</TableRow>
						) : (
							users.map((u) => (
								<TableRow key={u.id}>
									<TableCell>{u.name}</TableCell>
									<TableCell>{u.email}</TableCell>
									<TableCell>{u.username}</TableCell>
									<TableCell>
										<Badge variant={u.role === "admin" ? "default" : "secondary"}>
											{u.role}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant={u.banned ? "destructive" : "outline"}>
											{u.banned ? "已禁用" : "正常"}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-1">
											<Button
												variant="ghost"
												size="icon-sm"
												title={u.banned ? "启用" : "禁用"}
												onClick={() => handleToggleBan(u)}
											>
												{u.banned ? (
													<CheckCircle2 className="size-4" />
												) : (
													<Ban className="size-4" />
												)}
											</Button>
											<Button
												variant="ghost"
												size="icon-sm"
												title="重置密码"
												onClick={() => {
													setResetTarget(u);
													setResetPwd("");
												}}
											>
												<KeyRound className="size-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon-sm"
												title="删除"
												onClick={() => handleRemove(u)}
											>
												<Trash2 className="size-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{!loading && total > PAGE_SIZE ? (
				<div className="mt-3 flex items-center justify-end gap-2 text-sm">
					<Button
						variant="outline"
						size="sm"
						disabled={offset === 0}
						onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
					>
						上一页
					</Button>
					<span className="text-muted-foreground">
						{Math.floor(offset / PAGE_SIZE) + 1} / {pageCount}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={offset + PAGE_SIZE >= total}
						onClick={() => setOffset((o) => o + PAGE_SIZE)}
					>
						下一页
					</Button>
				</div>
			) : null}

			<Dialog open={createOpen} onOpenChange={setCreateOpen}>
				<DialogContent>
					<form onSubmit={handleCreate}>
						<DialogHeader>
							<DialogTitle>新增用户</DialogTitle>
							<DialogDescription>
								创建一个新用户账户，可指定角色。
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-3 py-4">
							<div className="grid gap-1.5">
								<Label htmlFor="c-name">名称</Label>
								<Input
									id="c-name"
									value={createForm.name}
									onValueChange={(v) =>
										setCreateForm((p) => ({ ...p, name: v }))
									}
									required
								/>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor="c-email">邮箱</Label>
								<Input
									id="c-email"
									type="email"
									value={createForm.email}
									onValueChange={(v) =>
										setCreateForm((p) => ({ ...p, email: v }))
									}
									required
								/>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor="c-username">用户名</Label>
								<Input
									id="c-username"
									value={createForm.username}
									onValueChange={(v) =>
										setCreateForm((p) => ({ ...p, username: v }))
									}
									required
								/>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor="c-password">密码</Label>
								<Input
									id="c-password"
									type="password"
									value={createForm.password}
									onValueChange={(v) =>
										setCreateForm((p) => ({ ...p, password: v }))
									}
									required
								/>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor="c-role">角色</Label>
								<Select
									value={createForm.role}
									onValueChange={(v) =>
										setCreateForm((p) => ({ ...p, role: v ?? "" }))
									}
								>
									<SelectTrigger id="c-role" className="w-full">
										<SelectValue placeholder="选择角色" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="user">普通用户</SelectItem>
										<SelectItem value="admin">管理员</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setCreateOpen(false)}
							>
								取消
							</Button>
							<Button type="submit" disabled={creating}>
								{creating ? "创建中…" : "创建用户"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!resetTarget}
				onOpenChange={(o) => !o && setResetTarget(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>重置密码</DialogTitle>
						<DialogDescription>
							为 {resetTarget?.email} 设置新的登录密码。
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-1.5 py-4">
						<Label htmlFor="r-pwd">新密码</Label>
						<Input
							id="r-pwd"
							type="password"
							value={resetPwd}
							onValueChange={setResetPwd}
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setResetTarget(null)}
						>
							取消
						</Button>
						<Button onClick={handleResetPassword} disabled={resetting}>
							{resetting ? "重置中…" : "确认重置"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
