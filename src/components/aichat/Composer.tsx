"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function Composer({
	onSend,
	disabled,
}: {
	onSend: (text: string) => void;
	disabled?: boolean;
}) {
	const [value, setValue] = React.useState("");

	function submit() {
		const text = value.trim();
		if (!text || disabled) return;
		onSend(text);
		setValue("");
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				submit();
			}}
			className="flex items-end gap-2 border-t border-border p-3"
		>
			<Textarea
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						submit();
					}
				}}
				placeholder="给 AI 助手发送消息…（Enter 发送，Shift+Enter 换行）"
				rows={3}
				className="min-h-0 resize-none"
			/>
			<Button
				type="submit"
				size="icon"
				disabled={disabled || !value.trim()}
				aria-label="发送"
			>
				<Send className="size-4" />
			</Button>
		</form>
	);
}
