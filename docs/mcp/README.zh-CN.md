# Cline 和模型上下文协议（MCP）服务器：增强 AI 能力

**快速链接：**

-   [从 GitHub 构建 MCP 服务器](mcp-server-from-github.zh-CN.md)
-   [从头开始构建自定义 MCP 服务器](mcp-server-from-scratch.zh-CN.md)

本文档解释了模型上下文协议（MCP）服务器的功能以及 Cline 如何帮助构建和使用它们。

## 概述

MCP 服务器充当大型语言模型（LLMs，如 Claude）与外部工具或数据源之间的中介。它们是小型程序，通过 MCP 向 LLMs 提供功能，使它们能够与外部世界交互。MCP 服务器本质上就像是 LLM 可以使用的 API。

## 关键概念

MCP 服务器定义了一组"**工具**"，这些工具是 LLM 可以执行的函数。这些工具提供了广泛的功能。

**MCP 的工作原理：**

-   **MCP 主机**发现已连接服务器的功能并加载它们的工具、提示和资源。
-   **资源**提供对只读数据的一致访问，类似于文件路径或数据库查询。
-   **安全性**通过服务器隔离凭证和敏感数据来确保。交互需要明确的用户批准。

## 使用场景

MCP 服务器的潜力是巨大的。它们可以用于各种目的。

**以下是 MCP 服务器的一些具体使用示例：**

-   **Web 服务和 API 集成：**

    -   监控 GitHub 仓库的新问题
    -   根据特定触发器发布 Twitter 更新
    -   获取基于位置的实时天气数据

-   **浏览器自动化：**

    -   自动化 Web 应用程序测试
    -   抓取电商网站进行价格比较
    -   生成网站监控截图

-   **数据库查询：**

    -   生成每周销售报告
    -   分析客户行为模式
    -   创建业务指标的实时仪表板

-   **项目和任务管理：**

    -   根据代码提交自动创建 Jira 工单
    -   生成每周进度报告
    -   根据项目需求创建任务依赖关系

-   **代码库文档：**
    -   从代码注释生成 API 文档
    -   从代码结构创建架构图
    -   维护最新的 README 文件

## 入门

**根据你的需求选择合适的方法：**

-   **使用现有服务器：** 从 GitHub 仓库开始使用预构建的 MCP 服务器
-   **定制现有服务器：** 修改现有服务器以满足你的特定需求
-   **从头构建：** 为独特的用例创建完全自定义的服务器

## 与 Cline 的集成

Cline 通过其 AI 功能简化了 MCP 服务器的构建和使用。

### 构建 MCP 服务器

-   **自然语言理解：** 通过描述功能，用自然语言指导 Cline 构建 MCP 服务器。Cline 将解释你的指令并生成必要的代码。
-   **克隆和构建服务器：** Cline 可以从 GitHub 自动克隆现有的 MCP 服务器仓库并构建它们。
-   **配置和依赖管理：** Cline 处理配置文件、环境变量和依赖项。
-   **故障排除和调试：** Cline 帮助识别和解决开发过程中的错误。

### 使用 MCP 服务器

-   **工具执行：** Cline 与 MCP 服务器无缝集成，允许你执行它们定义的工具。
-   **上下文感知交互：** Cline 可以根据对话上下文智能地建议使用相关工具。
-   **动态集成：** 组合多个 MCP 服务器的功能来完成复杂任务。例如，Cline 可以使用 GitHub 服务器获取数据，并使用 Notion 服务器创建格式化的报告。

## 安全注意事项

使用 MCP 服务器时，遵循安全最佳实践很重要：

-   **身份验证：** 始终使用安全的身份验证方法进行 API 访问
-   **环境变量：** 在环境变量中存储敏感信息
-   **访问控制：** 仅限授权用户访问服务器
-   **数据验证：** 验证所有输入以防止注入攻击
-   **日志记录：** 实施安全的日志记录实践，不暴露敏感数据

## 资源

有各种资源可用于查找和了解 MCP 服务器。

**以下是一些查找和了解 MCP 服务器的资源链接：**

-   **GitHub 仓库：** [https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) 和 [https://github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
-   **在线目录：** [https://mcpservers.org/](https://mcpservers.org/)、[https://mcp.so/](https://mcp.so/) 和 [https://glama.ai/mcp/servers](https://glama.ai/mcp/servers)
-   **PulseMCP：** [https://www.pulsemcp.com/](https://www.pulsemcp.com/)
-   **YouTube 教程（AI-Driven Coder）：** 构建和使用 MCP 服务器的视频指南：[https://www.youtube.com/watch?v=b5pqTNiuuJg](https://www.youtube.com/watch?v=b5pqTNiuuJg)