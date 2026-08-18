import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
	title: "注册",
	description: "创建新账号",
};

export default function RegisterPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
			<RegisterForm />
		</main>
	);
}
