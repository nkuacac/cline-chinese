import { Anthropic } from "@anthropic-ai/sdk"
import { withRetry } from "../retry"
import OpenAI from "openai"
import { ApiHandlerOptions, ModelInfo, arkModels } from "../../shared/api"
import { ApiHandler } from "../index"
import { ApiStream } from "../transform/stream"
import { convertToR1Format } from "../transform/r1-format"

interface ArkModel {
	id: string
	max_tokens: number
	context_window: number
	supports_images: boolean
	supports_computer_use: boolean
	supports_prompt_cache: boolean
	input_price: number
	output_price: number
	description: string
}

interface ArkModelsResponse {
	models: ArkModel[]
}

export class ArkHandler implements ApiHandler {
	private options: ApiHandlerOptions
	private client: OpenAI
	private models: Record<string, ModelInfo> = {}

	constructor(options: ApiHandlerOptions) {
		this.options = options
		this.client = new OpenAI({
			baseURL: this.options.volcEndpoint || "https://ark.cn-beijing.volces.com/api/v3",
			apiKey: this.options.volcApiKey,
		})
	}

	@withRetry()
	async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
		console.log("[ArkHandler] 开始创建消息，使用模型:", this.options.apiModelId)

		// 将系统提示和消息转换为 R1 格式
		const r1Messages = convertToR1Format([{ role: "user", content: systemPrompt }, ...messages])

		const stream = await this.client.chat.completions.create({
			model: this.options.apiModelId || "",
			messages: r1Messages,
			temperature: 0,
			stream: true,
			stream_options: { include_usage: true },
		})
		for await (const chunk of stream) {
			const delta = chunk.choices[0]?.delta
			if (delta?.content) {
				yield {
					type: "text",
					text: delta.content,
				}
			}

			if (delta && "reasoning_content" in delta && delta.reasoning_content) {
				yield {
					type: "reasoning",
					reasoning: (delta.reasoning_content as string | undefined) || "",
				}
			}

			if (chunk.usage) {
				yield {
					type: "usage",
					inputTokens: chunk.usage.prompt_tokens || 0,
					outputTokens: chunk.usage.completion_tokens || 0,
				}
			}
		}
	}

	getModel(): { id: string; info: ModelInfo } {
		console.log("Getting Ark model:", this.options.apiModelId)
		this.models = arkModels

		// 如果没有提供模型ID或模型不存在，返回默认模型
		const modelId = this.options.apiModelId || "doubao-1-5-vision-pro-32k-250115"
		const model = this.models[modelId]
		console.log("Found model:", model)

		if (!model) {
			console.log("Model not found, using default model")
			return {
				id: "doubao-1-5-vision-pro-32k-250115",
				info: {
					maxTokens: 4096,
					contextWindow: 200000,
					supportsImages: true,
					supportsComputerUse: true,
					supportsPromptCache: false,
					inputPrice: 0.0001,
					outputPrice: 0.0002,
					description:
						"相比于Doubao-vision-pro-32k/241028，Doubao-1.5-vision-Pro增强了模型在视觉推理、文字文档识别、细粒度信息理解、指令遵循方面的能力。",
				},
			}
		}

		return {
			id: modelId,
			info: {
				...model,
			},
		}
	}
}
