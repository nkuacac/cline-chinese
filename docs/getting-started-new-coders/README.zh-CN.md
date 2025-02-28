# Cline 新手入门指南

欢迎使用 Cline！本指南将帮助你完成设置并开始使用 Cline 构建你的第一个项目。

## 你需要准备什么

在开始之前，请确保你已经准备好以下内容：

-   **VS Code：** 一个免费且功能强大的代码编辑器。
    -   [下载 VS Code](https://code.visualstudio.com/)
-   **开发工具：** 基本的编程软件（Homebrew、Node.js、Git 等）。
    -   按照我们的[安装基本开发工具](installing-dev-essentials.md)指南进行设置（在完成这里的设置之后）
    -   Cline 会指导你安装所需的一切
-   **Cline 项目文件夹：** 一个专门用于存放所有 Cline 项目的文件夹。
    -   在 macOS 上：在你的文档文件夹中创建一个名为 "Cline" 的文件夹
        -   路径：`/Users/[你的用户名]/Documents/Cline`
    -   在 Windows 上：在你的文档文件夹中创建一个名为 "Cline" 的文件夹
        -   路径：`C:\Users\[你的用户名]\Documents\Cline`
    -   在这个 Cline 文件夹内，为每个项目创建单独的文件夹
        -   例如：`Documents/Cline/workout-app` 用于健身追踪应用
        -   例如：`Documents/Cline/portfolio-website` 用于你的个人作品集
-   **VS Code 中的 Cline 扩展：** 在 VS Code 中安装 Cline 扩展。

-   这里有一个[教程](https://www.youtube.com/watch?v=N4td-fKhsOQ)，介绍了入门所需的一切。

## 逐步设置

按照以下步骤启动并运行 Cline：

1. **打开 VS Code：** 启动 VS Code 应用程序。如果 VS Code 显示 "Running extensions might..."，点击 "Allow"。

2. **打开你的 Cline 文件夹：** 在 VS Code 中，打开你在文档中创建的 Cline 文件夹。

3. **导航到扩展：** 点击 VS Code 侧边栏中的扩展图标。

4. **搜索 'Cline'：** 在扩展搜索栏中，输入 "Cline"。

5. **安装扩展：** 点击 Cline 扩展旁边的 "安装" 按钮。

6. **打开 Cline：** 安装完成后，你可以通过以下几种方式打开 Cline：
    - 点击活动栏中的 Cline 图标。
    - 使用命令面板（`CMD/CTRL + Shift + P`）并输入 "Cline: Open In New Tab" 在编辑器中打开 Cline 标签页。这是推荐的方式，可以获得更好的视图。
    - **故障排除：** 如果你看不到 Cline 图标，尝试重启 VS Code。
    - **你将看到：** 你应该会看到 Cline 聊天窗口出现在你的 VS Code 编辑器中。

![gettingStartedVsCodeCline](https://github.com/user-attachments/assets/622b4bb7-859b-4c2e-b87b-c12e3eabefb8)

## 设置 OpenRouter API 密钥

现在你已经安装了 Cline，你需要设置 OpenRouter API 密钥来使用 Cline 的全部功能。

1.  **获取你的 OpenRouter API 密钥：**
    -   [获取你的 OpenRouter API 密钥](https://openrouter.ai/)
2.  **输入你的 OpenRouter API 密钥：**
    -   导航到 Cline 扩展中的设置按钮。
    -   输入你的 OpenRouter API 密钥。
    -   选择你偏好的 API 模型。
        -   **推荐的编程模型：**
            -   `anthropic/claude-3.5-sonnet`：最常用于编程任务。
            -   `google/gemini-2.0-flash-exp:free`：免费的编程选项。
            -   `deepseek/deepseek-chat`：超级便宜，几乎和 3.5 sonnet 一样好
        -   [OpenRouter 模型排名](https://openrouter.ai/rankings/programming)

## 你的第一次 Cline 互动

现在你已经准备好开始使用 Cline 构建了。让我们创建你的第一个项目文件夹并开始构建！将以下提示复制并粘贴到 Cline 聊天窗口中：

```
Hey Cline! Could you help me create a new project folder called "hello-world" in my Cline directory and make a simple webpage that says "Hello World" in big blue text?
```

**你将看到：** Cline 会帮助你创建项目文件夹并设置你的第一个网页。

## 使用 Cline 的技巧

-   **提问：** 如果你对某些事情不确定，不要犹豫，直接问 Cline！
-   **使用截图：** Cline 可以理解图片，所以随时可以使用截图来展示你正在处理的内容。
-   **复制和粘贴错误：** 如果你遇到错误，将错误信息复制并粘贴到 Cline 的聊天中。这将帮助他理解问题并提供解决方案。
-   **使用简单的语言：** Cline 被设计为能理解普通的、非技术性的语言。随意用你自己的话描述你的想法，Cline 会将它们转换成代码。

## 常见问题

-   **什么是终端？** 终端是一个基于文本的界面，用于与你的计算机交互。它允许你运行命令来执行各种任务，比如安装软件包、运行脚本和管理文件。Cline 使用终端来执行命令并与你的开发环境交互。
-   **代码库是如何工作的？** （这部分将根据新手程序员的常见问题进行扩展）

## 仍然遇到困难？

随时联系我，我会帮助你开始使用 Cline。

nick | 608-558-2410

加入我们的 Discord 社区：[https://discord.gg/cline](https://discord.gg/cline)