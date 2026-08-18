import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
	title: "忘记密码",
	description: "通过邮箱验证码重置密码",
};

export default function ForgotPasswordPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
			<ForgotPasswordForm />
		</main>
	);
}
