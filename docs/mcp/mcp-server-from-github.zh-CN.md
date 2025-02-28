# 从 GitHub 仓库构建 MCP 服务器

本指南提供了如何使用 Cline 从 GitHub 仓库构建现有 MCP 服务器的逐步说明。

## **查找 MCP 服务器**

有多个在线平台可以找到 MCP 服务器：

-   **Cline 可以自动将 MCP 服务器添加到其列表中，然后你可以编辑它们。** Cline 可以直接从 GitHub 克隆仓库并为你构建服务器。
-   **GitHub：** 在 GitHub 上找到 MCP 服务器的两个最常见地方包括：
    -   [官方 MCP 服务器仓库](https://github.com/modelcontextprotocol/servers)
    -   [Awesome-MCP 服务器仓库](https://github.com/punkpeye/awesome-mcp-servers)
-   **在线目录：** 多个网站列出了 MCP 服务器，包括：

    -   [mcpservers.org](https://mcpservers.org/)
    -   [mcp.so](https://mcp.so/)
    -   [glama.ai/mcp/servers](https://glama.ai/mcp/servers)

    这些目录允许用户按下载量、日期、星标和用例等各种标准对服务器进行排序。每个条目都提供了功能、工具和配置说明等信息。

-   **PulseMCP：** 这个网站有一篇博文讨论了 AI 如何使用 MCP 服务器使网站过时。PulseMCP 还包括一个关于 MCP 服务器的常见问题部分：[https://www.pulsemcp.com/](https://www.pulsemcp.com/)

## **使用 Cline 构建**

1.  **启动流程：** 向 Cline 提供以下信息：
    -   **GitHub 仓库 URL：** 服务器仓库的 URL。
    -   **README.md 内容：** 这是可选的，但有助于 Cline 理解服务器的用途和配置。你可以从 GitHub 仓库复制 README.md 文件。
2.  **与 Cline 的交互示例：**

    ```
    用户："Cline，我想添加 Brave 浏览器控制的 MCP 服务器。这是 GitHub 链接：https://github.com/modelcontextprotocol/servers/tree/main/src/brave 你能添加它吗？"

    Cline："好的。正在将仓库克隆到 MCP 目录。它需要构建，因为它有一个 'package.json' 文件。我要运行 'npm run build' 吗？"

    用户："是的，构建它。"

    Cline："构建完成。这个服务器需要一个浏览器路径。你的 Brave 浏览器可执行文件在哪里？"

    用户："它在 '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'。"

    Cline："好的。我已经用该路径更新了服务器配置并将其添加到 'cline_mcp_settings.json'。还需要其他什么吗？"

    用户："不，就这些。让我们测试一下。"

    Cline："很好！正在启动 MCP Inspector 来测试服务器连接。之后，我们可以尝试从 Cline 控制浏览器。"
    ```

3.  **Cline 的操作：** 根据你的指示，Cline 将执行以下操作：
    -   **仓库克隆：** Cline 会将仓库克隆到你的本地机器，通常是在你配置中指定的目录中。
    -   **调整：** 你可以指导 Cline 修改服务器的配置。例如：
        -   **用户：** "这个服务器需要一个 API 密钥。你能找到应该在哪里添加它吗？"
        -   Cline 可能会根据你的指示自动更新 `cline_mcp_settings.json` 文件或其他相关文件。
    -   **构建服务器：** Cline 将运行服务器的适当构建命令，通常是 `npm run build`。
    -   **添加服务器到设置：** Cline 将把服务器的配置添加到 `cline_mcp_settings.json` 文件中。

## **测试和故障排除**

1.  **测试服务器：** 一旦 Cline 完成构建过程，测试服务器以确保它按预期工作。如果你遇到任何问题，Cline 可以帮助你。
2.  **MCP Inspector：** 你可以使用 MCP Inspector 来测试服务器的连接和功能。

## **最佳实践**

-   **理解基础知识：** 虽然 Cline 简化了这个过程，但了解服务器的代码、MCP 协议和如何配置服务器的基本知识是有帮助的。这可以让你更有效地进行故障排除和定制。
-   **清晰的指示：** 在整个过程中向 Cline 提供清晰和具体的指示。
-   **测试：** 安装和配置后彻底测试服务器，以确保它正常工作。
-   **版本控制：** 使用版本控制系统（如 Git）来跟踪服务器代码的变更。
-   **保持更新：** 保持你的 MCP 服务器更新，以获得最新的功能和安全补丁。