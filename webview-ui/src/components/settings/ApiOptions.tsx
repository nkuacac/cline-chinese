import {
	VSCodeCheckbox,
	VSCodeDropdown,
	VSCodeLink,
	VSCodeOption,
	VSCodeRadio,
	VSCodeRadioGroup,
	VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react"
import { Fragment, memo, useCallback, useEffect, useMemo, useState } from "react"
import { useEvent, useInterval } from "react-use"
import {
	ApiConfiguration,
	ApiProvider,
	ModelInfo,
	anthropicDefaultModelId,
	anthropicModels,
	azureOpenAiDefaultApiVersion,
	bedrockDefaultModelId,
	bedrockModels,
	deepSeekDefaultModelId,
	deepSeekModels,
	qwenDefaultModelId,
	qwenModels,
	geminiDefaultModelId,
	geminiModels,
	mistralDefaultModelId,
	mistralModels,
	openAiModelInfoSaneDefaults,
	openAiNativeDefaultModelId,
	openAiNativeModels,
	openRouterDefaultModelId,
	openRouterDefaultModelInfo,
	vertexDefaultModelId,
	vertexModels,
	arkModels,
} from "../../../../src/shared/api"
import { ExtensionMessage } from "../../../../src/shared/ExtensionMessage"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { vscode } from "../../utils/vscode"
import VSCodeButtonLink from "../common/VSCodeButtonLink"
import OpenRouterModelPicker, { ModelDescriptionMarkdown } from "./OpenRouterModelPicker"
import styled from "styled-components"
import * as vscodemodels from "vscode"
import { getAsVar, VSC_DESCRIPTION_FOREGROUND } from "../../utils/vscStyles"

interface ApiOptionsProps {
	showModelOptions: boolean
	apiErrorMessage?: string
	modelIdErrorMessage?: string
	isPopup?: boolean
}

// This is necessary to ensure dropdown opens downward, important for when this is used in popup
const DROPDOWN_Z_INDEX = 1001 // Higher than the OpenRouterModelPicker's and ModelSelectorTooltip's z-index

const DropdownContainer = styled.div<{ zIndex?: number }>`
	position: relative;
	z-index: ${(props) => props.zIndex || DROPDOWN_Z_INDEX};

	// Force dropdowns to open downward
	& vscode-dropdown::part(listbox) {
		position: absolute !important;
		top: 100% !important;
		bottom: auto !important;
	}
`

declare module "vscode" {
	interface LanguageModelChatSelector {
		vendor?: string
		family?: string
		version?: string
		id?: string
	}
}

const ApiOptions = ({ showModelOptions, apiErrorMessage, modelIdErrorMessage, isPopup }: ApiOptionsProps) => {
	const { apiConfiguration, setApiConfiguration, uriScheme } = useExtensionState()
	const [ollamaModels, setOllamaModels] = useState<string[]>([])
	const [lmStudioModels, setLmStudioModels] = useState<string[]>([])
	const [vsCodeLmModels, setVsCodeLmModels] = useState<vscodemodels.LanguageModelChatSelector[]>([])
	const [anthropicBaseUrlSelected, setAnthropicBaseUrlSelected] = useState(!!apiConfiguration?.anthropicBaseUrl)
	const [azureApiVersionSelected, setAzureApiVersionSelected] = useState(!!apiConfiguration?.azureApiVersion)
	const [modelConfigurationSelected, setModelConfigurationSelected] = useState(false)
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

	const handleInputChange = (field: keyof ApiConfiguration) => (event: any) => {
		setApiConfiguration({
			...apiConfiguration,
			[field]: event.target.value,
		})
	}

	const { selectedProvider, selectedModelId, selectedModelInfo } = useMemo(() => {
		return normalizeApiConfiguration(apiConfiguration)
	}, [apiConfiguration])

	// Poll ollama/lmstudio models
	const requestLocalModels = useCallback(() => {
		if (selectedProvider === "ollama") {
			vscode.postMessage({
				type: "requestOllamaModels",
				text: apiConfiguration?.ollamaBaseUrl,
			})
		} else if (selectedProvider === "lmstudio") {
			vscode.postMessage({
				type: "requestLmStudioModels",
				text: apiConfiguration?.lmStudioBaseUrl,
			})
		} else if (selectedProvider === "vscode-lm") {
			vscode.postMessage({ type: "requestVsCodeLmModels" })
		}
	}, [selectedProvider, apiConfiguration?.ollamaBaseUrl, apiConfiguration?.lmStudioBaseUrl])
	useEffect(() => {
		if (selectedProvider === "ollama" || selectedProvider === "lmstudio" || selectedProvider === "vscode-lm") {
			requestLocalModels()
		}
	}, [selectedProvider, requestLocalModels])
	useInterval(
		requestLocalModels,
		selectedProvider === "ollama" || selectedProvider === "lmstudio" || selectedProvider === "vscode-lm" ? 2000 : null,
	)

	const handleMessage = useCallback((event: MessageEvent) => {
		const message: ExtensionMessage = event.data
		if (message.type === "ollamaModels" && message.ollamaModels) {
			setOllamaModels(message.ollamaModels)
		} else if (message.type === "lmStudioModels" && message.lmStudioModels) {
			setLmStudioModels(message.lmStudioModels)
		} else if (message.type === "vsCodeLmModels" && message.vsCodeLmModels) {
			setVsCodeLmModels(message.vsCodeLmModels)
		}
	}, [])
	useEvent("message", handleMessage)

	/*
	VSCodeDropdown has an open bug where dynamically rendered options don't auto select the provided value prop. You can see this for yourself by comparing  it with normal select/option elements, which work as expected.
	https://github.com/microsoft/vscode-webview-ui-toolkit/issues/433

	In our case, when the user switches between providers, we recalculate the selectedModelId depending on the provider, the default model for that provider, and a modelId that the user may have selected. Unfortunately, the VSCodeDropdown component wouldn't select this calculated value, and would default to the first "Select a model..." option instead, which makes it seem like the model was cleared out when it wasn't.

	As a workaround, we create separate instances of the dropdown for each provider, and then conditionally render the one that matches the current provider.
	*/
	const createDropdown = (models: Record<string, ModelInfo>) => {
		return (
			<VSCodeDropdown
				id="model-id"
				value={selectedModelId}
				onChange={handleInputChange("apiModelId")}
				style={{ width: "100%" }}>
				<VSCodeOption value="">选择模型...</VSCodeOption>
				{Object.keys(models).map((modelId) => (
					<VSCodeOption
						key={modelId}
						value={modelId}
						style={{
							whiteSpace: "normal",
							wordWrap: "break-word",
							maxWidth: "100%",
						}}>
						{modelId}
					</VSCodeOption>
				))}
			</VSCodeDropdown>
		)
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: isPopup ? -10 : 0 }}>
			<DropdownContainer className="dropdown-container">
				<label htmlFor="api-provider">
					<span style={{ fontWeight: 500 }}>API 提供者</span>
				</label>
				<VSCodeDropdown
					id="api-provider"
					value={selectedProvider}
					onChange={handleInputChange("apiProvider")}
					style={{
						minWidth: 130,
						position: "relative",
					}}>
					<VSCodeOption value="openrouter">OpenRouter</VSCodeOption>
					<VSCodeOption value="anthropic">Anthropic</VSCodeOption>
					<VSCodeOption value="bedrock">AWS Bedrock</VSCodeOption>
					<VSCodeOption value="openai">OpenAI Compatible</VSCodeOption>
					<VSCodeOption value="vertex">GCP Vertex AI</VSCodeOption>
					<VSCodeOption value="gemini">Google Gemini</VSCodeOption>
					<VSCodeOption value="deepseek">DeepSeek</VSCodeOption>
					<VSCodeOption value="mistral">Mistral</VSCodeOption>
					<VSCodeOption value="openai-native">OpenAI</VSCodeOption>
					<VSCodeOption value="vscode-lm">VS Code LM API</VSCodeOption>
					<VSCodeOption value="requesty">Requesty</VSCodeOption>
					<VSCodeOption value="together">Together</VSCodeOption>
					<VSCodeOption value="qwen">Alibaba Qwen</VSCodeOption>
					<VSCodeOption value="lmstudio">LM Studio</VSCodeOption>
					<VSCodeOption value="ollama">Ollama</VSCodeOption>
					<VSCodeOption value="litellm">LiteLLM</VSCodeOption>
					<VSCodeOption value="ark">ARK</VSCodeOption>
				</VSCodeDropdown>
			</DropdownContainer>

			{selectedProvider === "anthropic" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.apiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("apiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>Anthropic API Key</span>
					</VSCodeTextField>

					<VSCodeCheckbox
						checked={anthropicBaseUrlSelected}
						onChange={(e: any) => {
							const isChecked = e.target.checked === true
							setAnthropicBaseUrlSelected(isChecked)
							if (!isChecked) {
								setApiConfiguration({
									...apiConfiguration,
									anthropicBaseUrl: "",
								})
							}
						}}>
						使用自定义基础 URL
					</VSCodeCheckbox>

					{anthropicBaseUrlSelected && (
						<VSCodeTextField
							value={apiConfiguration?.anthropicBaseUrl || ""}
							style={{ width: "100%", marginTop: 3 }}
							type="url"
							onInput={handleInputChange("anthropicBaseUrl")}
							placeholder="Default: https://api.anthropic.com"
						/>
					)}

					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						此密钥仅存储在本地，仅用于从此扩展发送 API 请求。
						{!apiConfiguration?.apiKey && (
							<VSCodeLink
								href="https://console.anthropic.com/settings/keys"
								style={{
									display: "inline",
									fontSize: "inherit",
								}}>
								您可以在这里注册并获取 Anthropic API 密钥。
							</VSCodeLink>
						)}
					</p>
				</div>
			)}

			{selectedProvider === "openai-native" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.openAiNativeApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("openAiNativeApiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>OpenAI API Key</span>
					</VSCodeTextField>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						此密钥仅存储在本地，仅用于从此扩展发送 API 请求。
						{!apiConfiguration?.openAiNativeApiKey && (
							<VSCodeLink
								href="https://platform.openai.com/api-keys"
								style={{
									display: "inline",
									fontSize: "inherit",
								}}>
								您可以在这里注册并获取 OpenAI API 密钥。
							</VSCodeLink>
						)}
					</p>
				</div>
			)}

			{selectedProvider === "deepseek" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.deepSeekApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("deepSeekApiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>DeepSeek API Key</span>
					</VSCodeTextField>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						此密钥仅存储在本地，仅用于从此扩展发送 API 请求。
						{!apiConfiguration?.deepSeekApiKey && (
							<VSCodeLink
								href="https://www.deepseek.com/"
								style={{
									display: "inline",
									fontSize: "inherit",
								}}>
								您可以在这里注册并获取 DeepSeek API 密钥。
							</VSCodeLink>
						)}
					</p>
				</div>
			)}

			{selectedProvider === "qwen" && (
				<div>
					<DropdownContainer className="dropdown-container" style={{ position: "inherit" }}>
						<label htmlFor="qwen-line-provider">
							<span style={{ fontWeight: 500, marginTop: 5 }}>阿里巴巴 API 线路</span>
						</label>
						<VSCodeDropdown
							id="qwen-line-provider"
							value={apiConfiguration?.qwenApiLine || "china"}
							onChange={handleInputChange("qwenApiLine")}
							style={{
								minWidth: 130,
								position: "relative",
							}}>
							<VSCodeOption value="china">中国 API</VSCodeOption>
							<VSCodeOption value="international">国际 API</VSCodeOption>
						</VSCodeDropdown>
					</DropdownContainer>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						请根据您的位置选择合适的 API 接口。如果您在中国，请选择中国 API 接口。否则，请选择国际 API 接口。
					</p>
					<VSCodeTextField
						value={apiConfiguration?.qwenApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("qwenApiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>通义千问 API 密钥</span>
					</VSCodeTextField>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						此密钥仅存储在本地，仅用于从此扩展发送 API 请求。
						{!apiConfiguration?.qwenApiKey && (
							<VSCodeLink
								href="https://bailian.console.aliyun.com/"
								style={{
									display: "inline",
									fontSize: "inherit",
								}}>
								您可以在这里注册并获取通义千问 API 密钥。
							</VSCodeLink>
						)}
					</p>
				</div>
			)}

			{selectedProvider === "mistral" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.mistralApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("mistralApiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>Mistral API 密钥</span>
					</VSCodeTextField>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						此密钥仅存储在本地，仅用于从此扩展发送 API 请求。
						{!apiConfiguration?.mistralApiKey && (
							<VSCodeLink
								href="https://console.mistral.ai/codestral"
								style={{
									display: "inline",
									fontSize: "inherit",
								}}>
								您可以在这里注册并获取 Mistral API 密钥。
							</VSCodeLink>
						)}
					</p>
				</div>
			)}

			{selectedProvider === "openrouter" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.openRouterApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("openRouterApiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>OpenRouter API 密钥</span>
					</VSCodeTextField>
					{!apiConfiguration?.openRouterApiKey && (
						<VSCodeButtonLink
							href={getOpenRouterAuthUrl(uriScheme)}
							style={{ margin: "5px 0 0 0" }}
							appearance="secondary">
							获取 OpenRouter API 密钥
						</VSCodeButtonLink>
					)}
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						此密钥仅存储在本地，仅用于从此扩展发送 API 请求。{" "}
						<span style={{ color: "var(--vscode-charts-green)" }}>
							(<span style={{ fontWeight: 500 }}>注意：</span> OpenRouter
							推荐用于高速率限制、提示缓存和更广泛的模型选择。)
						</span>
					</p>
				</div>
			)}

			{selectedProvider === "bedrock" && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 5,
					}}>
					<VSCodeRadioGroup
						value={apiConfiguration?.awsUseProfile ? "profile" : "credentials"}
						onChange={(e) => {
							const value = (e.target as HTMLInputElement)?.value
							const useProfile = value === "profile"
							setApiConfiguration({
								...apiConfiguration,
								awsUseProfile: useProfile,
							})
						}}>
						<VSCodeRadio value="credentials">AWS Credentials</VSCodeRadio>
						<VSCodeRadio value="profile">AWS Profile</VSCodeRadio>
					</VSCodeRadioGroup>

					{apiConfiguration?.awsUseProfile ? (
						<VSCodeTextField
							value={apiConfiguration?.awsProfile || ""}
							style={{ width: "100%" }}
							onInput={handleInputChange("awsProfile")}
							placeholder="请输入配置文件名称（留空则使用默认值）">
							<span style={{ fontWeight: 500 }}>AWS Profile Name</span>
						</VSCodeTextField>
					) : (
						<>
							<VSCodeTextField
								value={apiConfiguration?.awsAccessKey || ""}
								style={{ width: "100%" }}
								type="password"
								onInput={handleInputChange("awsAccessKey")}
								placeholder="请输入访问密钥...">
								<span style={{ fontWeight: 500 }}>AWS Access Key</span>
							</VSCodeTextField>
							<VSCodeTextField
								value={apiConfiguration?.awsSecretKey || ""}
								style={{ width: "100%" }}
								type="password"
								onInput={handleInputChange("awsSecretKey")}
								placeholder="请输入密钥...">
								<span style={{ fontWeight: 500 }}>AWS Secret Key</span>
							</VSCodeTextField>
							<VSCodeTextField
								value={apiConfiguration?.awsSessionToken || ""}
								style={{ width: "100%" }}
								type="password"
								onInput={handleInputChange("awsSessionToken")}
								placeholder="请输入会话令牌...">
								<span style={{ fontWeight: 500 }}>AWS Session Token</span>
							</VSCodeTextField>
						</>
					)}
					<DropdownContainer zIndex={DROPDOWN_Z_INDEX - 1} className="dropdown-container">
						<label htmlFor="aws-region-dropdown">
							<span style={{ fontWeight: 500 }}>AWS Region</span>
						</label>
						<VSCodeDropdown
							id="aws-region-dropdown"
							value={apiConfiguration?.awsRegion || ""}
							style={{ width: "100%" }}
							onChange={handleInputChange("awsRegion")}>
							<VSCodeOption value="">Select a region...</VSCodeOption>
							{/* The user will have to choose a region that supports the model they use, but this shouldn't be a problem since they'd have to request access for it in that region in the first place. */}
							<VSCodeOption value="us-east-1">us-east-1</VSCodeOption>
							<VSCodeOption value="us-east-2">us-east-2</VSCodeOption>
							{/* <VSCodeOption value="us-west-1">us-west-1</VSCodeOption> */}
							<VSCodeOption value="us-west-2">us-west-2</VSCodeOption>
							{/* <VSCodeOption value="af-south-1">af-south-1</VSCodeOption> */}
							{/* <VSCodeOption value="ap-east-1">ap-east-1</VSCodeOption> */}
							<VSCodeOption value="ap-south-1">ap-south-1</VSCodeOption>
							<VSCodeOption value="ap-northeast-1">ap-northeast-1</VSCodeOption>
							<VSCodeOption value="ap-northeast-2">ap-northeast-2</VSCodeOption>
							{/* <VSCodeOption value="ap-northeast-3">ap-northeast-3</VSCodeOption> */}
							<VSCodeOption value="ap-southeast-1">ap-southeast-1</VSCodeOption>
							<VSCodeOption value="ap-southeast-2">ap-southeast-2</VSCodeOption>
							<VSCodeOption value="ca-central-1">ca-central-1</VSCodeOption>
							<VSCodeOption value="eu-central-1">eu-central-1</VSCodeOption>
							<VSCodeOption value="eu-central-2">eu-central-2</VSCodeOption>
							<VSCodeOption value="eu-west-1">eu-west-1</VSCodeOption>
							<VSCodeOption value="eu-west-2">eu-west-2</VSCodeOption>
							<VSCodeOption value="eu-west-3">eu-west-3</VSCodeOption>
							{/* <VSCodeOption value="eu-north-1">eu-north-1</VSCodeOption> */}
							{/* <VSCodeOption value="me-south-1">me-south-1</VSCodeOption> */}
							<VSCodeOption value="sa-east-1">sa-east-1</VSCodeOption>
							<VSCodeOption value="us-gov-east-1">us-gov-east-1</VSCodeOption>
							<VSCodeOption value="us-gov-west-1">us-gov-west-1</VSCodeOption>
							{/* <VSCodeOption value="us-gov-east-1">us-gov-east-1</VSCodeOption> */}
						</VSCodeDropdown>
					</DropdownContainer>
					<VSCodeCheckbox
						checked={apiConfiguration?.awsUseCrossRegionInference || false}
						onChange={(e: any) => {
							const isChecked = e.target.checked === true
							setApiConfiguration({
								...apiConfiguration,
								awsUseCrossRegionInference: isChecked,
							})
						}}>
						Use cross-region inference
					</VSCodeCheckbox>
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						{apiConfiguration?.awsUseProfile ? (
							<>
								使用来自 ~/.aws/credentials 的 AWS Profile 凭证。如需使用默认配置文件，请将配置文件名称留空。
								这些凭证仅在本地存储，仅用于从此扩展发送 API 请求。
							</>
						) : (
							<>
								您可以通过提供上述密钥进行身份验证，或使用默认的 AWS 凭证提供程序（如 ~/.aws/credentials
								或环境变量）。 这些凭证仅在本地存储，仅用于从此扩展发送 API 请求。
							</>
						)}
					</p>
				</div>
			)}

			{apiConfiguration?.apiProvider === "vertex" && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 5,
					}}>
					<VSCodeTextField
						value={apiConfiguration?.vertexProjectId || ""}
						style={{ width: "100%" }}
						onInput={handleInputChange("vertexProjectId")}
						placeholder="请输入项目 ID...">
						<span style={{ fontWeight: 500 }}>Google Cloud 项目 ID</span>
					</VSCodeTextField>
					<DropdownContainer zIndex={DROPDOWN_Z_INDEX - 2} className="dropdown-container">
						<label htmlFor="vertex-region-dropdown">
							<span style={{ fontWeight: 500 }}>Google Cloud 地区</span>
						</label>
						<VSCodeDropdown
							id="vertex-region-dropdown"
							value={apiConfiguration?.vertexRegion || ""}
							style={{ width: "100%" }}
							onChange={handleInputChange("vertexRegion")}>
							<VSCodeOption value="">选择一个区域...</VSCodeOption>
							<VSCodeOption value="us-east5">us-east5</VSCodeOption>
							<VSCodeOption value="us-central1">us-central1</VSCodeOption>
							<VSCodeOption value="europe-west1">europe-west1</VSCodeOption>
							<VSCodeOption value="europe-west4">europe-west4</VSCodeOption>
							<VSCodeOption value="asia-southeast1">asia-southeast1</VSCodeOption>
						</VSCodeDropdown>
					</DropdownContainer>
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						要使用 Google Cloud Vertex AI，您需要
						<VSCodeLink
							href="https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude#before_you_begin"
							style={{ display: "inline", fontSize: "inherit" }}>
							{"1) 创建 Google Cloud 账号 › 启用 Vertex AI API › 启用所需的 Claude 模型，"}
						</VSCodeLink>{" "}
						<VSCodeLink
							href="https://cloud.google.com/docs/authentication/provide-credentials-adc#google-idp"
							style={{ display: "inline", fontSize: "inherit" }}>
							{"2) 安装 Google Cloud CLI › 配置应用程序默认凭证。"}
						</VSCodeLink>
					</p>
				</div>
			)}

			{selectedProvider === "gemini" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.geminiApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("geminiApiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>Gemini API Key</span>
					</VSCodeTextField>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						此密钥仅存储在本地，仅用于从此扩展发送 API 请求。
						{!apiConfiguration?.geminiApiKey && (
							<VSCodeLink
								href="https://ai.google.dev/"
								style={{
									display: "inline",
									fontSize: "inherit",
								}}>
								您可以在这里注册并获取 Gemini API 密钥。
							</VSCodeLink>
						)}
					</p>
				</div>
			)}

			{selectedProvider === "openai" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.openAiBaseUrl || ""}
						style={{ width: "100%" }}
						type="url"
						onInput={handleInputChange("openAiBaseUrl")}
						placeholder={"Enter base URL..."}>
						<span style={{ fontWeight: 500 }}>Base URL</span>
					</VSCodeTextField>
					<VSCodeTextField
						value={apiConfiguration?.openAiApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("openAiApiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>API Key</span>
					</VSCodeTextField>
					<VSCodeTextField
						value={apiConfiguration?.openAiModelId || ""}
						style={{ width: "100%" }}
						onInput={handleInputChange("openAiModelId")}
						placeholder={"Enter Model ID..."}>
						<span style={{ fontWeight: 500 }}>Model ID</span>
					</VSCodeTextField>
					<VSCodeCheckbox
						checked={azureApiVersionSelected}
						onChange={(e: any) => {
							const isChecked = e.target.checked === true
							setAzureApiVersionSelected(isChecked)
							if (!isChecked) {
								setApiConfiguration({
									...apiConfiguration,
									azureApiVersion: "",
								})
							}
						}}>
						Set Azure API version
					</VSCodeCheckbox>
					{azureApiVersionSelected && (
						<VSCodeTextField
							value={apiConfiguration?.azureApiVersion || ""}
							style={{ width: "100%", marginTop: 3 }}
							onInput={handleInputChange("azureApiVersion")}
							placeholder={`Default: ${azureOpenAiDefaultApiVersion}`}
						/>
					)}
					<div
						style={{
							color: getAsVar(VSC_DESCRIPTION_FOREGROUND),
							display: "flex",
							margin: "10px 0",
							cursor: "pointer",
							alignItems: "center",
						}}
						onClick={() => setModelConfigurationSelected((val) => !val)}>
						<span
							className={`codicon ${modelConfigurationSelected ? "codicon-chevron-down" : "codicon-chevron-right"}`}
							style={{
								marginRight: "4px",
							}}></span>
						<span
							style={{
								fontWeight: 700,
								textTransform: "uppercase",
							}}>
							模型配置
						</span>
					</div>
					{modelConfigurationSelected && (
						<>
							<VSCodeCheckbox
								checked={!!apiConfiguration?.openAiModelInfo?.supportsImages}
								onChange={(e: any) => {
									const isChecked = e.target.checked === true
									let modelInfo = apiConfiguration?.openAiModelInfo
										? apiConfiguration.openAiModelInfo
										: { ...openAiModelInfoSaneDefaults }
									modelInfo.supportsImages = isChecked
									setApiConfiguration({
										...apiConfiguration,
										openAiModelInfo: modelInfo,
									})
								}}>
								Supports Images
							</VSCodeCheckbox>
							<div style={{ display: "flex", gap: 10, marginTop: "5px" }}>
								<VSCodeTextField
									value={
										apiConfiguration?.openAiModelInfo?.contextWindow
											? apiConfiguration.openAiModelInfo.contextWindow.toString()
											: openAiModelInfoSaneDefaults.contextWindow?.toString()
									}
									style={{ flex: 1 }}
									onInput={(input: any) => {
										let modelInfo = apiConfiguration?.openAiModelInfo
											? apiConfiguration.openAiModelInfo
											: { ...openAiModelInfoSaneDefaults }
										modelInfo.contextWindow = Number(input.target.value)
										setApiConfiguration({
											...apiConfiguration,
											openAiModelInfo: modelInfo,
										})
									}}>
									<span style={{ fontWeight: 500 }}>上下文窗口大小</span>
								</VSCodeTextField>
								<VSCodeTextField
									value={
										apiConfiguration?.openAiModelInfo?.maxTokens
											? apiConfiguration.openAiModelInfo.maxTokens.toString()
											: openAiModelInfoSaneDefaults.maxTokens?.toString()
									}
									style={{ flex: 1 }}
									onInput={(input: any) => {
										let modelInfo = apiConfiguration?.openAiModelInfo
											? apiConfiguration.openAiModelInfo
											: { ...openAiModelInfoSaneDefaults }
										modelInfo.maxTokens = input.target.value
										setApiConfiguration({
											...apiConfiguration,
											openAiModelInfo: modelInfo,
										})
									}}>
									<span style={{ fontWeight: 500 }}>最大输出Token数</span>
								</VSCodeTextField>
							</div>
							<div style={{ display: "flex", gap: 10, marginTop: "5px" }}>
								<VSCodeTextField
									value={
										apiConfiguration?.openAiModelInfo?.inputPrice
											? apiConfiguration.openAiModelInfo.inputPrice.toString()
											: openAiModelInfoSaneDefaults.inputPrice?.toString()
									}
									style={{ flex: 1 }}
									onInput={(input: any) => {
										let modelInfo = apiConfiguration?.openAiModelInfo
											? apiConfiguration.openAiModelInfo
											: { ...openAiModelInfoSaneDefaults }
										modelInfo.inputPrice = input.target.value
										setApiConfiguration({
											...apiConfiguration,
											openAiModelInfo: modelInfo,
										})
									}}>
									<span style={{ fontWeight: 500 }}>输入价格 / 1M tokens</span>
								</VSCodeTextField>
								<VSCodeTextField
									value={
										apiConfiguration?.openAiModelInfo?.outputPrice
											? apiConfiguration.openAiModelInfo.outputPrice.toString()
											: openAiModelInfoSaneDefaults.outputPrice?.toString()
									}
									style={{ flex: 1 }}
									onInput={(input: any) => {
										let modelInfo = apiConfiguration?.openAiModelInfo
											? apiConfiguration.openAiModelInfo
											: { ...openAiModelInfoSaneDefaults }
										modelInfo.outputPrice = input.target.value
										setApiConfiguration({
											...apiConfiguration,
											openAiModelInfo: modelInfo,
										})
									}}>
									<span style={{ fontWeight: 500 }}>输出价格 / 1M tokens</span>
								</VSCodeTextField>
							</div>
						</>
					)}
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						<span style={{ color: "var(--vscode-errorForeground)" }}>
							(<span style={{ fontWeight: 500 }}>注意：</span> Cline 使用复杂的提示，与 Claude
							模型配合效果最佳。功能较弱的模型可能无法达到预期效果。)
						</span>
					</p>
				</div>
			)}

			{selectedProvider === "requesty" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.requestyApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("requestyApiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>API Key</span>
					</VSCodeTextField>
					<VSCodeTextField
						value={apiConfiguration?.requestyModelId || ""}
						style={{ width: "100%" }}
						onInput={handleInputChange("requestyModelId")}
						placeholder={"输入模型ID..."}>
						<span style={{ fontWeight: 500 }}>Model ID</span>
					</VSCodeTextField>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						<span style={{ color: "var(--vscode-errorForeground)" }}>
							(<span style={{ fontWeight: 500 }}>注意：</span> Cline 使用复杂的提示，与 Claude
							模型配合效果最佳。功能较弱的模型可能无法达到预期效果。)
						</span>
					</p>
				</div>
			)}

			{selectedProvider === "together" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.togetherApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("togetherApiKey")}
						placeholder="请输入 API 密钥...">
						<span style={{ fontWeight: 500 }}>API Key</span>
					</VSCodeTextField>
					<VSCodeTextField
						value={apiConfiguration?.togetherModelId || ""}
						style={{ width: "100%" }}
						onInput={handleInputChange("togetherModelId")}
						placeholder={"输入模型ID..."}>
						<span style={{ fontWeight: 500 }}>Model ID</span>
					</VSCodeTextField>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						<span style={{ color: "var(--vscode-errorForeground)" }}>
							(<span style={{ fontWeight: 500 }}>注意：</span> Cline 使用复杂的提示，与 Claude
							模型配合效果最佳。功能较弱的模型可能无法达到预期效果。)
						</span>
					</p>
				</div>
			)}

			{selectedProvider === "vscode-lm" && (
				<div>
					<DropdownContainer zIndex={DROPDOWN_Z_INDEX - 2} className="dropdown-container">
						<label htmlFor="vscode-lm-model">
							<span style={{ fontWeight: 500 }}>语言模型</span>
						</label>
						{vsCodeLmModels.length > 0 ? (
							<VSCodeDropdown
								id="vscode-lm-model"
								value={
									apiConfiguration?.vsCodeLmModelSelector
										? `${apiConfiguration.vsCodeLmModelSelector.vendor ?? ""}/${apiConfiguration.vsCodeLmModelSelector.family ?? ""}`
										: ""
								}
								onChange={(e) => {
									const value = (e.target as HTMLInputElement).value
									if (!value) {
										return
									}
									const [vendor, family] = value.split("/")
									handleInputChange("vsCodeLmModelSelector")({
										target: {
											value: { vendor, family },
										},
									})
								}}
								style={{ width: "100%" }}>
								<VSCodeOption value="">Select a model...</VSCodeOption>
								{vsCodeLmModels.map((model) => (
									<VSCodeOption
										key={`${model.vendor}/${model.family}`}
										value={`${model.vendor}/${model.family}`}>
										{model.vendor} - {model.family}
									</VSCodeOption>
								))}
							</VSCodeDropdown>
						) : (
							<p
								style={{
									fontSize: "12px",
									marginTop: "5px",
									color: "var(--vscode-descriptionForeground)",
								}}>
								VS Code 语言模型 API 允许您运行由其他 VS Code 扩展（包括但不限于 GitHub Copilot）提供的模型。
								最简单的入门方式是从 VS Marketplace 安装 Copilot 扩展并启用 Claude 3.7 Sonnet。
							</p>
						)}

						<p
							style={{
								fontSize: "12px",
								marginTop: "5px",
								color: "var(--vscode-errorForeground)",
								fontWeight: 500,
							}}>
							注意：这是一个非常实验性的集成，可能无法按预期工作。
						</p>
					</DropdownContainer>
				</div>
			)}

			{selectedProvider === "lmstudio" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.lmStudioBaseUrl || ""}
						style={{ width: "100%" }}
						type="url"
						onInput={handleInputChange("lmStudioBaseUrl")}
						placeholder={"Default: http://localhost:1234"}>
						<span style={{ fontWeight: 500 }}>Base URL (optional)</span>
					</VSCodeTextField>
					<VSCodeTextField
						value={apiConfiguration?.lmStudioModelId || ""}
						style={{ width: "100%" }}
						onInput={handleInputChange("lmStudioModelId")}
						placeholder={"e.g. meta-llama-3.1-8b-instruct"}>
						<span style={{ fontWeight: 500 }}>Model ID</span>
					</VSCodeTextField>
					{lmStudioModels.length > 0 && (
						<VSCodeRadioGroup
							value={
								lmStudioModels.includes(apiConfiguration?.lmStudioModelId || "")
									? apiConfiguration?.lmStudioModelId
									: ""
							}
							onChange={(e) => {
								const value = (e.target as HTMLInputElement)?.value
								// need to check value first since radio group returns empty string sometimes
								if (value) {
									handleInputChange("lmStudioModelId")({
										target: { value },
									})
								}
							}}>
							{lmStudioModels.map((model) => (
								<VSCodeRadio key={model} value={model} checked={apiConfiguration?.lmStudioModelId === model}>
									{model}
								</VSCodeRadio>
							))}
						</VSCodeRadioGroup>
					)}
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						LM Studio 允许您在本地计算机上运行模型。要了解如何开始使用，请查看他们的
						<VSCodeLink href="https://lmstudio.ai/docs" style={{ display: "inline", fontSize: "inherit" }}>
							快速入门指南
						</VSCodeLink>
						。 您还需要启动 LM Studio 的{" "}
						<VSCodeLink
							href="https://lmstudio.ai/docs/basics/server"
							style={{ display: "inline", fontSize: "inherit" }}>
							本地服务器
						</VSCodeLink>{" "}
						功能才能与此扩展一起使用。{" "}
						<span style={{ color: "var(--vscode-errorForeground)" }}>
							(<span style={{ fontWeight: 500 }}>注意：</span> Cline 使用复杂的提示，与 Claude
							模型配合效果最佳。功能较弱的模型可能无法达到预期效果。)
						</span>
					</p>
				</div>
			)}

			{selectedProvider === "litellm" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.liteLlmApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("liteLlmApiKey")}
						placeholder="Default: noop">
						<span style={{ fontWeight: 500 }}>API Key</span>
					</VSCodeTextField>
					<VSCodeTextField
						value={apiConfiguration?.liteLlmBaseUrl || ""}
						style={{ width: "100%" }}
						type="url"
						onInput={handleInputChange("liteLlmBaseUrl")}
						placeholder={"Default: http://localhost:4000"}>
						<span style={{ fontWeight: 500 }}>Base URL (optional)</span>
					</VSCodeTextField>
					<VSCodeTextField
						value={apiConfiguration?.liteLlmModelId || ""}
						style={{ width: "100%" }}
						onInput={handleInputChange("liteLlmModelId")}
						placeholder={"e.g. gpt-4"}>
						<span style={{ fontWeight: 500 }}>Model ID</span>
					</VSCodeTextField>
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						LiteLLM 提供了一个统一的接口来访问各种 LLM 提供商的模型。查看他们的{" "}
						<VSCodeLink href="https://docs.litellm.ai/docs/" style={{ display: "inline", fontSize: "inherit" }}>
							快速入门指南
						</VSCodeLink>{" "}
						了解更多信息。
					</p>
				</div>
			)}

			{selectedProvider === "ollama" && (
				<div>
					<VSCodeTextField
						value={apiConfiguration?.ollamaBaseUrl || ""}
						style={{ width: "100%" }}
						type="url"
						onInput={handleInputChange("ollamaBaseUrl")}
						placeholder={"Default: http://localhost:11434"}>
						<span style={{ fontWeight: 500 }}>Base URL (optional)</span>
					</VSCodeTextField>
					<VSCodeTextField
						value={apiConfiguration?.ollamaModelId || ""}
						style={{ width: "100%" }}
						onInput={handleInputChange("ollamaModelId")}
						placeholder={"e.g. llama3.1"}>
						<span style={{ fontWeight: 500 }}>Model ID</span>
					</VSCodeTextField>
					{ollamaModels.length > 0 && (
						<VSCodeRadioGroup
							value={
								ollamaModels.includes(apiConfiguration?.ollamaModelId || "")
									? apiConfiguration?.ollamaModelId
									: ""
							}
							onChange={(e) => {
								const value = (e.target as HTMLInputElement)?.value
								// need to check value first since radio group returns empty string sometimes
								if (value) {
									handleInputChange("ollamaModelId")({
										target: { value },
									})
								}
							}}>
							{ollamaModels.map((model) => (
								<VSCodeRadio key={model} value={model} checked={apiConfiguration?.ollamaModelId === model}>
									{model}
								</VSCodeRadio>
							))}
						</VSCodeRadioGroup>
					)}
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						Ollama 允许您在本地计算机上运行模型。要了解如何开始使用，请查看他们的
						<VSCodeLink
							href="https://github.com/ollama/ollama/blob/main/README.md"
							style={{ display: "inline", fontSize: "inherit" }}>
							快速入门指南
						</VSCodeLink>
						<span style={{ color: "var(--vscode-errorForeground)" }}>
							(<span style={{ fontWeight: 500 }}>注意：</span> Cline 使用复杂的提示，与 Claude
							模型配合效果最佳。功能较弱的模型可能无法达到预期效果。)
						</span>
					</p>
				</div>
			)}

			{selectedProvider === "ark" && (
				<div>
					<p
						style={{
							fontSize: "12px",
							marginTop: 3,
							color: "var(--vscode-descriptionForeground)",
						}}>
						方舟是
						<VSCodeLink href="https://console.volcengine.com/" style={{ display: "inline", fontSize: "inherit" }}>
							字节火山平台
						</VSCodeLink>
						开发的AI模型服务平台，如何使用请参考：
						<VSCodeLink
							href="https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey"
							style={{ display: "inline", fontSize: "inherit" }}>
							获取APIKey
						</VSCodeLink>
						<VSCodeLink
							href="https://console.volcengine.com/ark/region:ark+cn-beijing/openManagement"
							style={{ display: "inline", fontSize: "inherit" }}>
							开通模型
						</VSCodeLink>
					</p>
					<VSCodeTextField
						value={apiConfiguration?.volcApiKey || ""}
						style={{ width: "100%" }}
						type="password"
						onInput={handleInputChange("volcApiKey")}
						placeholder="请输入火山引擎 API Key...">
						<span style={{ fontWeight: 500 }}>火山引擎 API Key</span>
					</VSCodeTextField>

					<VSCodeTextField
						value={apiConfiguration?.volcEndpoint || ""}
						style={{ width: "100%" }}
						type="url"
						onInput={handleInputChange("volcEndpoint")}
						placeholder="请输入火山引擎 API 端点...">
						<span style={{ fontWeight: 500 }}>火山引擎 API 端点</span>
					</VSCodeTextField>

					<VSCodeTextField
						value={apiConfiguration?.apiModelId || ""}
						style={{ width: "100%" }}
						onInput={handleInputChange("apiModelId")}
						placeholder={"输入模型ID or 接入点..."}>
						<span style={{ fontWeight: 500 }}>模型ID or 接入点</span>
					</VSCodeTextField>
				</div>
			)}

			{apiErrorMessage && (
				<p
					style={{
						margin: "-10px 0 4px 0",
						fontSize: 12,
						color: "var(--vscode-errorForeground)",
					}}>
					{apiErrorMessage}
				</p>
			)}

			{selectedProvider !== "openrouter" &&
				selectedProvider !== "openai" &&
				selectedProvider !== "ollama" &&
				selectedProvider !== "lmstudio" &&
				selectedProvider !== "vscode-lm" &&
				showModelOptions && (
					<>
						<DropdownContainer zIndex={DROPDOWN_Z_INDEX - 2} className="dropdown-container">
							<label htmlFor="model-id">
								<span style={{ fontWeight: 500 }}>Model</span>
							</label>
							{selectedProvider === "anthropic" && createDropdown(anthropicModels)}
							{selectedProvider === "bedrock" && createDropdown(bedrockModels)}
							{selectedProvider === "vertex" && createDropdown(vertexModels)}
							{selectedProvider === "gemini" && createDropdown(geminiModels)}
							{selectedProvider === "openai-native" && createDropdown(openAiNativeModels)}
							{selectedProvider === "deepseek" && createDropdown(deepSeekModels)}
							{selectedProvider === "qwen" && createDropdown(qwenModels)}
							{selectedProvider === "mistral" && createDropdown(mistralModels)}
							{selectedProvider === "ark" && createDropdown(arkModels)}
						</DropdownContainer>

						<ModelInfoView
							selectedModelId={selectedModelId}
							modelInfo={selectedModelInfo}
							isDescriptionExpanded={isDescriptionExpanded}
							setIsDescriptionExpanded={setIsDescriptionExpanded}
							isPopup={isPopup}
						/>
					</>
				)}

			{selectedProvider === "openrouter" && showModelOptions && <OpenRouterModelPicker isPopup={isPopup} />}

			{modelIdErrorMessage && (
				<p
					style={{
						margin: "-10px 0 4px 0",
						fontSize: 12,
						color: "var(--vscode-errorForeground)",
					}}>
					{modelIdErrorMessage}
				</p>
			)}
		</div>
	)
}

export function getOpenRouterAuthUrl(uriScheme?: string) {
	return `https://openrouter.ai/auth?callback_url=${uriScheme || "vscode"}://saoudrizwan.claude-dev/openrouter`
}

export const formatPrice = (price: number) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price)
}

export const ModelInfoView = ({
	selectedModelId,
	modelInfo,
	isDescriptionExpanded,
	setIsDescriptionExpanded,
	isPopup,
}: {
	selectedModelId: string
	modelInfo: ModelInfo
	isDescriptionExpanded: boolean
	setIsDescriptionExpanded: (isExpanded: boolean) => void
	isPopup?: boolean
}) => {
	const isGemini = Object.keys(geminiModels).includes(selectedModelId)

	const infoItems = [
		modelInfo.description && (
			<ModelDescriptionMarkdown
				key="description"
				markdown={modelInfo.description}
				isExpanded={isDescriptionExpanded}
				setIsExpanded={setIsDescriptionExpanded}
				isPopup={isPopup}
			/>
		),
		<ModelInfoSupportsItem
			key="supportsImages"
			isSupported={modelInfo.supportsImages ?? false}
			supportsLabel="支持图片"
			doesNotSupportLabel="不支持图片"
		/>,
		<ModelInfoSupportsItem
			key="supportsComputerUse"
			isSupported={modelInfo.supportsComputerUse ?? false}
			supportsLabel="支持计算机使用"
			doesNotSupportLabel="不支持计算机使用"
		/>,
		!isGemini && (
			<ModelInfoSupportsItem
				key="supportsPromptCache"
				isSupported={modelInfo.supportsPromptCache}
				supportsLabel="支持提示缓存"
				doesNotSupportLabel="不支持提示缓存"
			/>
		),
		modelInfo.maxTokens !== undefined && modelInfo.maxTokens > 0 && (
			<span key="maxTokens">
				<span style={{ fontWeight: 500 }}>最大输出:</span> {modelInfo.maxTokens?.toLocaleString()} tokens
			</span>
		),
		modelInfo.inputPrice !== undefined && modelInfo.inputPrice > 0 && (
			<span key="inputPrice">
				<span style={{ fontWeight: 500 }}>输入价格:</span> {formatPrice(modelInfo.inputPrice)}/百万 tokens
			</span>
		),
		modelInfo.supportsPromptCache && modelInfo.cacheWritesPrice && (
			<span key="cacheWritesPrice">
				<span style={{ fontWeight: 500 }}>缓存写入价格:</span> {formatPrice(modelInfo.cacheWritesPrice || 0)}
				/million tokens
			</span>
		),
		modelInfo.supportsPromptCache && modelInfo.cacheReadsPrice && (
			<span key="cacheReadsPrice">
				<span style={{ fontWeight: 500 }}>缓存读取价格:</span> {formatPrice(modelInfo.cacheReadsPrice || 0)}/百万 tokens
			</span>
		),
		modelInfo.outputPrice !== undefined && modelInfo.outputPrice > 0 && (
			<span key="outputPrice">
				<span style={{ fontWeight: 500 }}>输出价格:</span> {formatPrice(modelInfo.outputPrice)}/百万 tokens
			</span>
		),
		isGemini && (
			<span key="geminiInfo" style={{ fontStyle: "italic" }}>
				* 每分钟免费使用 {selectedModelId && selectedModelId.includes("flash") ? "15" : "2"} 次请求。超出后，
				费用将根据提示大小计算。{" "}
				<VSCodeLink href="https://ai.google.dev/pricing" style={{ display: "inline", fontSize: "inherit" }}>
					查看详细定价信息
				</VSCodeLink>
			</span>
		),
	].filter(Boolean)

	return (
		<p
			style={{
				fontSize: "12px",
				marginTop: "2px",
				color: "var(--vscode-descriptionForeground)",
			}}>
			{infoItems.map((item, index) => (
				<Fragment key={index}>
					{item}
					{index < infoItems.length - 1 && <br />}
				</Fragment>
			))}
		</p>
	)
}

const ModelInfoSupportsItem = ({
	isSupported,
	supportsLabel,
	doesNotSupportLabel,
}: {
	isSupported: boolean
	supportsLabel: string
	doesNotSupportLabel: string
}) => (
	<span
		style={{
			fontWeight: 500,
			color: isSupported ? "var(--vscode-charts-green)" : "var(--vscode-errorForeground)",
		}}>
		<i
			className={`codicon codicon-${isSupported ? "check" : "x"}`}
			style={{
				marginRight: 4,
				marginBottom: isSupported ? 1 : -1,
				fontSize: isSupported ? 11 : 13,
				fontWeight: 700,
				display: "inline-block",
				verticalAlign: "bottom",
			}}></i>
		{isSupported ? supportsLabel : doesNotSupportLabel}
	</span>
)

export function normalizeApiConfiguration(apiConfiguration?: ApiConfiguration): {
	selectedProvider: ApiProvider
	selectedModelId: string
	selectedModelInfo: ModelInfo
} {
	const provider = apiConfiguration?.apiProvider || "anthropic"
	const modelId = apiConfiguration?.apiModelId

	const getProviderData = (models: Record<string, ModelInfo>, defaultId: string) => {
		let selectedModelId: string
		let selectedModelInfo: ModelInfo
		if (modelId && modelId in models) {
			selectedModelId = modelId
			selectedModelInfo = models[modelId]
		} else {
			selectedModelId = defaultId
			selectedModelInfo = models[defaultId]
		}
		return {
			selectedProvider: provider,
			selectedModelId,
			selectedModelInfo,
		}
	}
	switch (provider) {
		case "anthropic":
			return getProviderData(anthropicModels, anthropicDefaultModelId)
		case "bedrock":
			return getProviderData(bedrockModels, bedrockDefaultModelId)
		case "vertex":
			return getProviderData(vertexModels, vertexDefaultModelId)
		case "gemini":
			return getProviderData(geminiModels, geminiDefaultModelId)
		case "openai-native":
			return getProviderData(openAiNativeModels, openAiNativeDefaultModelId)
		case "deepseek":
			return getProviderData(deepSeekModels, deepSeekDefaultModelId)
		case "qwen":
			return getProviderData(qwenModels, qwenDefaultModelId)
		case "mistral":
			return getProviderData(mistralModels, mistralDefaultModelId)
		case "openrouter":
			return {
				selectedProvider: provider,
				selectedModelId: apiConfiguration?.openRouterModelId || openRouterDefaultModelId,
				selectedModelInfo: apiConfiguration?.openRouterModelInfo || openRouterDefaultModelInfo,
			}
		case "openai":
			return {
				selectedProvider: provider,
				selectedModelId: apiConfiguration?.openAiModelId || "",
				selectedModelInfo: openAiModelInfoSaneDefaults,
			}
		case "ollama":
			return {
				selectedProvider: provider,
				selectedModelId: apiConfiguration?.ollamaModelId || "",
				selectedModelInfo: openAiModelInfoSaneDefaults,
			}
		case "lmstudio":
			return {
				selectedProvider: provider,
				selectedModelId: apiConfiguration?.lmStudioModelId || "",
				selectedModelInfo: openAiModelInfoSaneDefaults,
			}
		case "vscode-lm":
			return {
				selectedProvider: provider,
				selectedModelId: apiConfiguration?.vsCodeLmModelSelector
					? `${apiConfiguration.vsCodeLmModelSelector.vendor}/${apiConfiguration.vsCodeLmModelSelector.family}`
					: "",
				selectedModelInfo: {
					...openAiModelInfoSaneDefaults,
					supportsImages: false, // VSCode LM API currently doesn't support images
				},
			}
		case "litellm":
			return {
				selectedProvider: provider,
				selectedModelId: apiConfiguration?.liteLlmModelId || "",
				selectedModelInfo: openAiModelInfoSaneDefaults,
			}
		case "ark":
			return {
				selectedProvider: provider,
				selectedModelId: apiConfiguration?.apiModelId || "",
				selectedModelInfo:
					apiConfiguration?.apiModelId && apiConfiguration.apiModelId in arkModels
						? arkModels[apiConfiguration.apiModelId as keyof typeof arkModels]
						: openAiModelInfoSaneDefaults,
			}
		default:
			return getProviderData(anthropicModels, anthropicDefaultModelId)
	}
}

export default memo(ApiOptions)
