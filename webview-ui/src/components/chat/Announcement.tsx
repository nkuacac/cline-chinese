import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { memo } from "react"
import { getAsVar, VSC_DESCRIPTION_FOREGROUND, VSC_INACTIVE_SELECTION_BACKGROUND } from "../../utils/vscStyles"
import { vscode } from "../../utils/vscode"

interface AnnouncementProps {
	version: string
	hideAnnouncement: () => void
}

/*
You must update the latestAnnouncementId in ClineProvider for new announcements to show to users. This new id will be compared with whats in state for the 'last announcement shown', and if it's different then the announcement will render. As soon as an announcement is shown, the id will be updated in state. This ensures that announcements are not shown more than once, even if the user doesn't close it themselves.
*/
const Announcement = ({ version, hideAnnouncement }: AnnouncementProps) => {
	const minorVersion = version.split(".").slice(0, 2).join(".") // 2.0.0 -> 2.0
	return (
		<div
			style={{
				backgroundColor: getAsVar(VSC_INACTIVE_SELECTION_BACKGROUND),
				borderRadius: "3px",
				padding: "12px 16px",
				margin: "5px 15px 5px 15px",
				position: "relative",
				flexShrink: 0,
			}}>
			<VSCodeButton appearance="icon" onClick={hideAnnouncement} style={{ position: "absolute", top: "8px", right: "8px" }}>
				<span className="codicon codicon-close"></span>
			</VSCodeButton>
			<h3 style={{ margin: "0 0 8px" }}>
				🎉{"  "}v{minorVersion} 新功能
			</h3>
			<ul style={{ margin: "0 0 8px", paddingLeft: "12px" }}>
				<li>
					<b>推出 MCP 市场：</b>直接在扩展中发现和安装最好的 MCP 服务器，并且会定期添加新的服务器！点击{" "}
					<span className="codicon codicon-extensions" style={{ marginRight: "4px", fontSize: 10 }}></span>
					<VSCodeLink
						onClick={() => {
							vscode.postMessage({ type: "showMcpView" })
						}}>
						MCP Servers 标签页
					</VSCodeLink>
					开始使用！
				</li>
				<li>
					<b>计划模式中的 Mermaid 图表！</b>现在 Cline
					可以使用流程图、序列图、实体关系图等方式来可视化他的计划。当他使用 mermaid
					解释他的方法时，你会在聊天中看到一个可点击展开的图表。
				</li>
				<li>
					使用 <code>@terminal</code> 来引用终端内容，使用 <code>@git</code> 来引用工作更改和提交！
				</li>
				<li>在编辑文件和运行命令后使用更多可视化的检查点指示器，并在每个任务开始时自动创建检查点。</li>
			</ul>
			<VSCodeLink href="https://x.com/sdrzn/status/1892262424881090721" style={{ display: "inline" }}>
				在这里查看更新演示！
			</VSCodeLink>
		</div>
	)
}

export default memo(Announcement)
