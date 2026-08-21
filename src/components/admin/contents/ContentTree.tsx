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
	fetchContentTree,
	moveNode,
	moveUp,
	moveDown,
	copyNode,
	deleteContent,
	createContent,
	TREE_ROOT_ID,
	type LoadedTree,
} from "./api";
import type { ContentNode } from "./types";
import { ContextMenu, type MenuItem } from "./ContextMenu";
import { cn } from "@/utils/cn";
import { File, Folder, FolderOpen, Plus, Trash2, ArrowUp, ArrowDown, Copy, Pencil, Loader2 } from "lucide-react";

const ROOT_ID = TREE_ROOT_ID;

interface ContextMenuState {
	x: number;
	y: number;
	itemId: string;
}

/** 外层：负责一次性加载整棵树，加载完成后才渲染树（以便首次即用 initialState 展开第一层） */
export function ContentTree({
	selectedId,
	onSelect,
	reloadSignal = 0,
	renameSignal = 0,
}: {
	selectedId: string | null;
	onSelect: (id: string | null) => void;
	reloadSignal?: number;
	renameSignal?: number;
}) {
	const [treeData, setTreeData] = useState<LoadedTree | null>(null);

	const load = useCallback(async () => {
		try {
			setTreeData(await fetchContentTree());
		} catch (e) {
			// 加载失败时保留上一次数据，错误由内层展示
			console.error(e);
		}
	}, []);

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (reloadSignal > 0) load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reloadSignal]);

	if (!treeData) {
		return (
			<div className="p-3 text-sm text-muted-foreground">加载内容树…</div>
		);
	}

		return (
			<TreeInner
				treeData={treeData}
				selectedId={selectedId}
				onSelect={onSelect}
				onChanged={load}
				renameSignal={renameSignal}
			/>
		);
}

function TreeInner({
	treeData,
	selectedId,
	onSelect,
	onChanged,
	renameSignal = 0,
}: {
	treeData: LoadedTree;
	selectedId: string | null;
	onSelect: (id: string | null) => void;
	onChanged: () => void;
	renameSignal?: number;
}) {
	const [menu, setMenu] = useState<ContextMenuState | null>(null);
	const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

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
		// 默认展开第一层：虚拟根 + 顶层节点（从而显示其下一级内容）
		initialState: {
			expandedItems: [ROOT_ID, ...treeData.firstLevel],
		},
		dataLoader: {
			getItem: (id) => {
				if (id === ROOT_ID) return { id: -1, name: "root", title: "root" } as ContentNode;
				return treeData.byId.get(id) ?? ({} as ContentNode);
			},
			getChildren: (id) => {
				return treeData.childrenOf.get(id) ?? [];
			},
		},
		getItemName: (item) => {
			const d = item.getItemData() as ContentNode | null;
			return d?.title || d?.name || String(item.getId());
		},
		isItemFolder: (item) => (treeData.childrenOf.get(item.getId())?.length ?? 0) > 0,
		onRename: async (item, value) => {
			await updateAndRefresh(item.getId(), { title: value, name: value });
		},
		canReorder: true,
		canDrag: () => true,
		canDrop: () => true,
		onDrop: async (items, target) => {
			for (const it of items) {
				const draggedId = it.getId();
				await runOp(
					draggedId,
					async () => {
						if (isOrderedDragTarget(target)) {
							const parentId = target.item.getId();
							const children = treeData.childrenOf.get(parentId) ?? [];
							const ref = children[target.childIndex];
							if (ref) {
								await moveNode(draggedId, ref, "previousSibling");
							} else if (children.length > 0) {
								await moveNode(draggedId, children[children.length - 1], "nextSibling");
							} else {
								await moveNode(draggedId, parentId, "lastChild");
							}
						} else {
							await moveNode(draggedId, target.item.getId(), "lastChild");
						}
					},
					"移动",
				);
			}
		},
	});

	/** 结构变更后整体重新加载整棵树（保留当前展开状态，由 headless-tree 复用 expandedItems） */
	const refresh = useCallback(() => {
		onChanged();
	}, [onChanged]);

	/**
	 * 统一的异步操作封装：操作期间在对应节点右侧显示旋转指示器，
	 * 失败时通过 App.toast 提示错误信息，成功/结束后刷新整棵树。
	 */
	const runOp = useCallback(
		async (id: string, fn: () => Promise<unknown>, label = "操作") => {
			setBusyIds((prev) => {
				const n = new Set(prev);
				n.add(id);
				return n;
			});
			try {
				const r = await fn();
				refresh();
				return r;
			} catch (e) {
				App.toast({
					type: "error",
					title: `${label}失败`,
					description: (e as Error)?.message || "未知错误",
				});
				return undefined;
			} finally {
				setBusyIds((prev) => {
					const n = new Set(prev);
					n.delete(id);
					return n;
				});
			}
		},
		[refresh],
	);

	useEffect(() => {
		tree.rebuildTree();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [treeData]);

	// 响应工具栏“重命名”请求：对当前选中节点触发内联重命名
	useEffect(() => {
		if (renameSignal <= 0 || !selectedId) return;
		const inst = tree.getItemInstance(selectedId);
		inst?.startRenaming?.();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [renameSignal]);

	async function updateAndRefresh(id: string, fields: Partial<ContentNode>) {
		await runOp(id, async () => {
			const res = await fetch(`/api/contents/${id}`, {
				method: "PATCH",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(fields),
			});
			if (!res.ok) {
				const b = await res.json().catch(() => ({}));
				throw new Error(b.error || `更新失败 (${res.status})`);
			}
		}, "重命名");
	}

	function buildMenuItems(itemId: string): MenuItem[] {
		const isRoot = itemId === ROOT_ID;
		const item = isRoot ? null : tree.getItemInstance(itemId);
		const parentId = isRoot ? null : (item?.getParent()?.getId() ?? null);

		const createChild = async () => {
			const name = window.prompt("新建节点名称（英文标识）：");
			if (!name) return;
			const title = window.prompt("显示标题：", name) ?? name;
			const node = (await runOp(
				isRoot ? ROOT_ID : itemId,
				() =>
					createContent({
						parentId: isRoot ? null : Number(itemId),
						name,
						title,
						type: 1,
					}),
				"新建子节点",
			)) as ContentNode | undefined;
			if (node) onSelect(String(node.id));
		};

		const createSibling = async () => {
			const name = window.prompt("新建同级节点名称（英文标识）：");
			if (!name) return;
			const title = window.prompt("显示标题：", name) ?? name;
			const node = (await runOp(
				parentId && parentId !== ROOT_ID ? parentId : ROOT_ID,
				() =>
					createContent({
						parentId: parentId && parentId !== ROOT_ID ? Number(parentId) : null,
						name,
						title,
						type: 1,
					}),
				"新建同级节点",
			)) as ContentNode | undefined;
			if (node) onSelect(String(node.id));
		};

		const rename = () => item?.startRenaming();
		const up = () => runOp(itemId, () => moveUp(itemId), "上移");
		const down = () => runOp(itemId, () => moveDown(itemId), "下移");
		const copy = () =>
			runOp(
				itemId,
				() => copyNode(itemId, parentId && parentId !== ROOT_ID ? Number(parentId) : undefined),
				"复制",
			);
		const remove = async () => {
			if (!window.confirm("确认删除该节点及其子节点？")) return;
			await runOp(
				itemId,
				async () => {
					await deleteContent(itemId);
					if (selectedId === itemId) onSelect(null);
				},
				"删除",
			);
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
						const level = item.getItemMeta().level;
						const isSelected = item.getId() === selectedId;
						const isFolder = item.isFolder();
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
								{isFolder ? (
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											if (item.isExpanded()) item.collapse();
											else item.expand();
										}}
										className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground"
										title={item.isExpanded() ? "折叠" : "展开"}
									>
										{item.isExpanded() ? (
											<FolderOpen className="h-4 w-4" />
										) : (
											<Folder className="h-4 w-4" />
										)}
									</button>
								) : (
									<span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
										<File className="h-4 w-4" />
									</span>
								)}
								<span className="truncate">{item.getItemName()}</span>
								{busyIds.has(item.getId()) && (
									<Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-muted-foreground" />
								)}
							</div>
						);
					})}
				</div>
			</div>
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
