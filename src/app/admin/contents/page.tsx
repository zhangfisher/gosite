"use client";

import { useState } from "react";
import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import { PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentTree } from "@/components/admin/contents/ContentTree";
import { ContentTabs } from "@/components/admin/contents/ContentTabs";
import { createContent } from "@/components/admin/contents/api";

export default function ContentsAdminPage() {
	const leftPanelRef = usePanelRef();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [reloadSignal, setReloadSignal] = useState(0);
	const [collapsed, setCollapsed] = useState(false);

	function refreshTree() {
		setReloadSignal((n) => n + 1);
	}

	async function addRoot() {
		const name = window.prompt("新建根节点名称（英文标识）：");
		if (!name) return;
		const title = window.prompt("显示标题：", name) ?? name;
		try {
			const node = await createContent({ parentId: null, name, title, type: 0 });
			refreshTree();
			setSelectedId(String(node.id));
		} catch (e) {
			window.alert((e as Error).message);
		}
	}

	return (
		<div className="flex h-full min-h-0 w-full">
			<Group orientation="horizontal" className="h-full w-full">
				<Panel
					panelRef={leftPanelRef}
					defaultSize={300}
					minSize={100}
					collapsible
					collapsedSize={0}
					maxSize={600}
					groupResizeBehavior="preserve-pixel-size"
					onResize={(_, __, prev) => {
						if (prev === undefined) return;
						setCollapsed(leftPanelRef.current?.isCollapsed() ?? false);
					}}
					className="min-w-0 overflow-hidden"
				>
					<div className="flex h-full min-h-0 flex-col bg-background">
						<div className="flex items-center justify-between border-b px-3 py-2">
							<span className="text-sm font-medium">所有内容</span>
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7"
									onClick={addRoot}
									title="新建根节点"
								>
									<Plus className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7"
									onClick={() => {
										if (leftPanelRef.current?.isCollapsed()) leftPanelRef.current?.expand();
										else leftPanelRef.current?.collapse();
									}}
									title={collapsed ? "展开" : "折叠"}
								>
									{collapsed ? (
										<PanelLeftOpen className="h-4 w-4" />
									) : (
										<PanelLeftClose className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
						<div className="min-h-0 flex-1">
							<ContentTree
								selectedId={selectedId}
								onSelect={setSelectedId}
								reloadSignal={reloadSignal}
							/>
						</div>
					</div>
				</Panel>
				<Separator className="relative w-1.5 bg-transparent">
					<div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
				</Separator>
				<Panel minSize={300} className="min-w-0 overflow-hidden">
					<ContentTabs
						selectedId={selectedId}
						onNodeUpdated={refreshTree}
						reloadSignal={reloadSignal}
					/>
				</Panel>
			</Group>
		</div>
	);
}
