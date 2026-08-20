"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

export interface MenuItem {
	label: string;
	icon?: React.ReactNode;
	onClick: () => void;
	danger?: boolean;
	disabled?: boolean;
}

export function ContextMenu({
	x,
	y,
	items,
	onClose,
}: {
	x: number;
	y: number;
	items: MenuItem[];
	onClose: () => void;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onMouseDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) onClose();
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("mousedown", onMouseDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [onClose]);

	// 防止超出视口
	const left = Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 9999) - 200);
	const top = Math.min(y, (typeof window !== "undefined" ? window.innerHeight : 9999) - items.length * 36 - 10);

	return (
		<div
			ref={ref}
			className="fixed z-50 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
			style={{ left, top }}
		>
			{items.map((it, i) => (
				<button
					key={i}
					type="button"
					disabled={it.disabled}
					onClick={() => {
						it.onClick();
						onClose();
					}}
					className={cn(
						"flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
						it.disabled && "cursor-not-allowed opacity-50",
						it.danger
							? "text-destructive hover:bg-destructive/10"
							: "hover:bg-accent hover:text-accent-foreground",
					)}
				>
					{it.icon}
					{it.label}
				</button>
			))}
		</div>
	);
}
