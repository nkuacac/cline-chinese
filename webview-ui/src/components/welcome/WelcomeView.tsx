import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { useCallback, useEffect, useState } from "react"
import { useEvent } from "react-use"
import { ExtensionMessage } from "../../../../src/shared/ExtensionMessage"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { validateApiConfiguration } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import ApiOptions from "../settings/ApiOptions"

const WelcomeView = () => {
	const { apiConfiguration } = useExtensionState()

	const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined)
	const [email, setEmail] = useState("")
	const [isSubscribed, setIsSubscribed] = useState(false)

	const disableLetsGoButton = apiErrorMessage != null

	const handleSubmit = () => {
		vscode.postMessage({ type: "apiConfiguration", apiConfiguration })
	}

	const handleSubscribe = () => {
		if (email) {
			vscode.postMessage({ type: "subscribeEmail", text: email })
		}
	}

	useEffect(() => {
		setApiErrorMessage(validateApiConfiguration(apiConfiguration))
	}, [apiConfiguration])

	// Add message handler for subscription confirmation
	const handleMessage = useCallback((e: MessageEvent) => {
		const message: ExtensionMessage = e.data
		if (message.type === "emailSubscribed") {
			setIsSubscribed(true)
			setEmail("")
		}
	}, [])

	useEvent("message", handleMessage)

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			}}>
			<div
				style={{
					height: "100%",
					padding: "0 20px",
					overflow: "auto",
				}}>
				<h2>你好，我是 Cline</h2>
				<p>
					得益于 Claude 3.7 Sonnet
					的智能编程能力，以及可以创建和编辑文件、探索复杂项目、使用浏览器和执行终端命令（当然，需要您的许可）的工具，我可以完成各种任务。我甚至可以使用
					MCP 创建新工具并扩展自己的功能。
				</p>

				<b>首先，这个扩展需要一个 Claude 3.7 Sonnet 的 API 提供者。</b>

				<div
					style={{
						marginTop: "15px",
						padding: isSubscribed ? "5px 15px 5px 15px" : "12px",
						background: "var(--vscode-textBlockQuote-background)",
						borderRadius: "6px",
						fontSize: "0.9em",
					}}>
					{isSubscribed ? (
						<p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
							<span style={{ color: "var(--vscode-testing-iconPassed)", fontSize: "1.5em" }}>✓</span>
							感谢订阅！我们会及时通知您新功能的更新。
						</p>
					) : (
						<>
							<p style={{ margin: 0, marginBottom: "8px" }}>
								虽然 Cline 目前需要您提供自己的 API
								密钥，但我们正在开发一个具有更多功能的官方账户系统。订阅我们的邮件列表以获取更新！
							</p>
							<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
								<VSCodeTextField
									type="email"
									value={email}
									onInput={(e: any) => setEmail(e.target.value)}
									placeholder="输入您的邮箱"
									style={{ flex: 1 }}
								/>
								<VSCodeButton appearance="secondary" onClick={handleSubscribe} disabled={!email}>
									订阅
								</VSCodeButton>
							</div>
						</>
					)}
				</div>

				<div style={{ marginTop: "15px" }}>
					<ApiOptions showModelOptions={false} />
					<VSCodeButton onClick={handleSubmit} disabled={disableLetsGoButton} style={{ marginTop: "3px" }}>
						开始使用！
					</VSCodeButton>
				</div>
			</div>
		</div>
	)
}

export default WelcomeView
