import { auth } from "../src/lib/auth";

/**
 * 创建初始管理员账号
 *
 * 用法：bun run scripts/seed-admin.ts <username> <email> <password> <name>
 * 默认：admin / admin@example.com / 22182666@hyt / Admin
 *
 * 通过 better-auth 的 signUpEmail 创建，密码会被正确哈希存储。
 */
const username = process.argv[2] || "admin";
const email = process.argv[3] || "admin@example.com";
const password = process.argv[4] || "22182666@hyt";
const name = process.argv[5] || "Admin";

try {
	const res = await auth.api.signUpEmail({
		body: { username, email, password, name },
		headers: new Headers(),
	});
	console.log(`已创建管理员账号：用户名=${username}，邮箱=${res.user.email}`);
} catch (err) {
	console.error("创建失败：", err instanceof Error ? err.message : err);
	process.exit(1);
}
