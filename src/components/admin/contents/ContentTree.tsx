"use client";

import { useCallback, useEffect, useState } from "react";
import { useTree } from "@headless-tree/react";
import {
	asyncDataLoaderFeature,
	dragAndDropFeature,
	keyboardDragAndDropFeature,
	selectionFeature,
	renamingFeature,
	expandAllFeature,
	hotkeysCoreFeature,
	isOrderedDragTarget,
} from "@headless-tree/core";
import {
	fetchRoots,
	fetchChildren,
	fetchNode,
	moveNode,
	moveUp,
	moveDown,
	copyNode,
	deleteContent,
	createContent,
} from "./api";
import type { ContentNode } from "./types";
import { ContextMenu, type MenuItem } from "./ContextMenu";
import { cn } from "@/utils/cn";
import { ChevronRight, ChevronDown, File, Folder, Plus, Trash2, ArrowUp, ArrowDown, Copy, Pencil } from "lucide-react";

const ROOT_ID = "__root__";

interface ContextMenuState {
	x: number;
	y: number;
	itemId: string;
}

export function ContentTree({
	selectedId,
	onSelect,
	reloadSignal = 0,
}: {
	selectedId: string | null;
	onSelect: (id: string | null) => void;
	reloadSignal?: number;
}) {
	const [menu, setMenu] = useState<ContextMenuState | null>(null);
	const [error, setError] = useState<string | null>(null);

	const tree = useTree<ContentNode>({
		rootItemId: ROOT_ID,
		features: [
			asyncDataLoaderFeature,
			dragAndDropFeature,
			keyboardDragAndDropFeature,
			selectionFeature,
			renamingFeature,
			expandAllFeature,
			hotkeysCoreFeature,
		],
		dataLoader: {
			getItem: (id) => {
				if (id === ROOT_ID) return { id: -1, name: "root", title: "root" } as ContentNode;
				return fetchNode(id);
			},
			getChildren: (id) => {
				if (id === ROOT_ID) return fetchRoots().then((r) => r.map((n) => String(n.id)));
				return fetchChildren(id).then((c) => c.map((n) => String(n.id)));
			},
		},
		getItemName: (item) => {
			const d = item.getItemData() as ContentNode | null;
			return d?.title || d?.name || String(item.getId());
		},
		isItemFolder: () => true,
		onRename: async (item, value) => {
			await updateAndRefresh(item.getId(), { title: value, name: value });
		},
		canReorder: true,
		canDrag: () => true,
		canDrop: () => true,
		onDrop: async (items, target) => {
			try {
				for (const it of items) {
					const draggedId = it.getId();
					if (isOrderedDragTarget(target)) {
						const parentId = target.item.getId();
						const children = await fetchChildren(parentId);
						const ref = children[target.childIndex];
						if (ref) {
							await moveNode(draggedId, ref.id, "previousSibling");
						} else if (children.length > 0) {
							await moveNode(draggedId, children[children.length - 1].id, "nextSibling");
						} else {
							await moveNode(draggedId, parentId, "lastChild");
						}
					} else {
						await moveNode(draggedId, target.item.getId(), "lastChild");
					}
				}
				refresh();
			} catch (e) {
				setError((e as Error).message);
			}
		},
	});

	const refresh = useCallback(() => {
		tree.getRootItem()?.invalidateChildrenIds();
		tree.getItems().forEach((i) => {
			i.invalidateChildrenIds();
			i.invalidateItemData();
		});
	}, [tree]);

	useEffect(() => {
		if (reloadSignal > 0) refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reloadSignal]);

	async function updateAndRefresh(id: string, fields: Partial<ContentNode>) {
		try {
			const res = await fetch(`/api/contents/${id}`, {
				method: "PATCH",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(fields),
			});
			if (!res.ok) {
				const b = await res.json().catch(() => ({}));
				throw new Error(b.error || `更新失败 (${res.status})`);
			}
			refresh();
		} catch (e) {
			setError((e as Error).message);
		}
	}

	function buildMenuItems(itemId: string): MenuItem[] {
		const isRoot = itemId === ROOT_ID;
		const item = isRoot ? null : tree.getItemInstance(itemId);
		const parentId = isRoot ? null : (item?.getParent()?.getId() ?? null);

		const createChild = async () => {
			const name = window.prompt("新建节点名称（英文标识）：");
			if (!name) return;
			const title = window.prompt("显示标题：", name) ?? name;
			try {
				const node = await createContent({
					parentId: isRoot ? null : Number(itemId),
					name,
					title,
					type: 1,
				});
				refresh();
				onSelect(String(node.id));
			} catch (e) {
				setError((e as Error).message);
			}
		};

		const createSibling = async () => {
			const name = window.prompt("新建同级节点名称（英文标识）：");
			if (!name) return;
			const title = window.prompt("显示标题：", name) ?? name;
			try {
				const node = await createContent({
					parentId: parentId && parentId !== ROOT_ID ? Number(parentId) : null,
					name,
					title,
					type: 1,
				});
				refresh();
				onSelect(String(node.id));
			} catch (e) {
				setError((e as Error).message);
			}
		};

		const rename = () => item?.startRenaming();
		const up = async () => {
			try {
				await moveUp(itemId);
				refresh();
			} catch (e) {
				setError((e as Error).message);
			}
		};
		const down = async () => {
			try {
				await moveDown(itemId);
				refresh();
			} catch (e) {
				setError((e as Error).message);
			}
		};
		const copy = async () => {
			try {
				await copyNode(itemId, parentId && parentId !== ROOT_ID ? Number(parentId) : undefined);
				refresh();
			} catch (e) {
				setError((e as Error).message);
			}
		};
		const remove = async () => {
			if (!window.confirm("确认删除该节点及其子节点？")) return;
			try {
				await deleteContent(itemId);
				if (selectedId === itemId) onSelect(null);
				refresh();
			} catch (e) {
				setError((e as Error).message);
			}
		};

		return [
			{ label: "新建子节点", icon: <Plus className="h-4 w-4" />, onClick: createChild },
			{ label: "新建同级节点", icon: <Plus className="h-4 w-4" />, onClick: createSibling, disabled: isRoot },
			{ label: "重命名", icon: <Pencil className="h-4 w-4" />, onClick: rename, disabled: isRoot },
			{ label: "上移", icon: <ArrowUp className="h-4 w-4" />, onClick: up, disabled: isRoot },
			{ label: "下移", icon: <ArrowDown className="h-4 w-4" />, onClick: down, disabled: isRoot },
			{ label: "复制", icon: <Copy className="h-4 w-4" />, onClick: copy, disabled: isRoot },
			{ label: "删除", icon: <Trash2 className="h-4 w-4" />, onClick: remove, danger: true, disabled: isRoot },
		];
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex-1 min-h-0 overflow-auto py-1">
				<div {...tree.getContainerProps("内容树")}>
					{tree.getItems().map((item) => {
						const data = item.getItemData() as ContentNode | null;
						const level = item.getItemMeta().level;
						const isSelected = item.getId() === selectedId;
						const isFolder = item.isFolder();
						const type: number = data?.type ?? 0;
						return (
							<div
								key={item.getKey()}
								{...item.getProps()}
								onClick={() => {
									onSelect(item.getId());
									item.toggleSelect();
								}}
								onContextMenu={(e) => {
									e.preventDefault();
									onSelect(item.getId());
									setMenu({ x: e.clientX, y: e.clientY, itemId: item.getId() });
								}}
								className={cn(
									"flex cursor-pointer items-center gap-1 rounded-sm px-1.5 py-1 text-sm",
									isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted",
								)}
								style={{ paddingLeft: level * 16 + 6 }}
							>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										if (item.isExpanded()) item.collapse();
										else item.expand();
									}}
									className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground"
								>
									{isFolder ? (
										item.isExpanded() ? (
											<ChevronDown className="h-4 w-4" />
										) : (
											<ChevronRight className="h-4 w-4" />
										)
									) : null}
								</button>
								<span className="shrink-0 text-muted-foreground">
									{isFolder ? (
										<Folder className="h-4 w-4" />
									) : type === 2 ? (
										<File className="h-4 w-4" />
									) : (
										<File className="h-4 w-4" />
									)}
								</span>
								<span className="truncate">{item.getItemName()}</span>
							</div>
						);
					})}
				</div>
			</div>
			{error && (
				<div className="border-t bg-destructive/10 px-2 py-1 text-xs text-destructive">{error}</div>
			)}
			{menu && (
				<ContextMenu
					x={menu.x}
					y={menu.y}
					items={buildMenuItems(menu.itemId)}
					onClose={() => setMenu(null)}
				/>
			)}
		</div>
	);
}
