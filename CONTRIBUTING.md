# 参与贡献 Cline Chinese

我们很高兴您有兴趣为 Cline Chinese做出贡献。无论是修复 bug、添加新功能，还是改进文档，每一份贡献都能让 Cline 变得更智能！为了保持我们的社区充满活力和友好，所有成员都必须遵守我们的[行为准则](CODE_OF_CONDUCT.md)。

## 报告 Bug 或问题

Bug 报告有助于让 Cline Chinese变得更好！在创建新问题之前，请先[搜索现有问题](https://github.com/HybridTalentComputing/cline-chinese/issues)以避免重复。当您准备报告 bug 时，请访问我们的[问题页面](https://github.com/HybridTalentComputing/cline-chinese/issues/new/choose)，那里有模板可以帮助您填写相关信息。

<blockquote class='warning-note'>
     🔐 <b>重要提示：</b> 如果您发现安全漏洞，请使用 <a href="https://github.com/HybridTalentComputing/cline-chinese/security/advisories/new">Github 安全工具私密报告</a>。
</blockquote>

## 决定参与什么

寻找一个好的首次贡献机会？查看标记为["good first issue"](https://github.com/HybridTalentComputing/cline-chinese/labels/good%20first%20issue)或["help wanted"](https://github.com/HybridTalentComputing/cline-chinese/labels/help%20wanted)的问题。这些是专门为新贡献者准备的，也是我们非常需要帮助的领域！

我们也欢迎对我们的[文档](https://github.com/HybridTalentComputing/cline-chinese/tree/main/docs)做出贡献！无论是修复错别字、改进现有指南，还是创建新的教育内容 - 我们都希望建立一个由社区驱动的资源库，帮助每个人充分利用 Cline。您可以从浏览 `/docs` 开始，寻找需要改进的地方。

如果您计划开发一个更大的功能，请先创建一个[功能请求](https://github.com/HybridTalentComputing/cline-chinese/discussions/categories/feature-requests?discussions_q=is%3Aopen+category%3A%22Feature+Requests%22+sort%3Atop)，以便我们讨论它是否符合 Cline Chinese的愿景。

## 开发环境设置

1. **VS Code 扩展**

    - 打开项目时，VS Code 会提示您安装推荐的扩展
    - 这些扩展是开发所必需的 - 请接受所有安装提示
    - 如果您忽略了提示，可以从扩展面板手动安装它们

2. **本地开发**
    - 运行 `npm run install:all` 安装依赖
    - 运行 `npm run test` 在本地运行测试
    - 提交 PR 前，运行 `npm run format:fix` 格式化代码

## 编写和提交代码

任何人都可以为 Cline 贡献代码，但我们要求您遵循以下准则，以确保您的贡献能够顺利集成：

1. **保持 Pull Request 的专注性**

    - 将 PR 限制在单个功能或 bug 修复
    - 将较大的更改拆分成较小的、相关的 PR
    - 将更改分解成可以独立审查的逻辑提交

2. **代码质量**

    - 运行 `npm run lint` 检查代码风格
    - 运行 `npm run format` 自动格式化代码
    - 所有 PR 必须通过包括代码风格和格式在内的 CI 检查
    - 提交前解决所有 ESLint 警告或错误
    - 遵循 TypeScript 最佳实践并保持类型安全

3. **测试**

    - 为新功能添加测试
    - 运行 `npm test` 确保所有测试通过
    - 如果您的更改影响了现有测试，请更新它们
    - 在适当的情况下包括单元测试和集成测试

4. **使用 Changesets 进行版本管理**

    - 使用 `npm run changeset` 为任何用户可见的更改创建 changeset
    - 选择适当的版本升级：
        - `major` 用于破坏性更改 (1.0.0 → 2.0.0)
        - `minor` 用于新功能 (1.0.0 → 1.1.0)
        - `patch` 用于 bug 修复 (1.0.0 → 1.0.1)
    - 编写清晰、描述性的 changeset 消息，解释影响
    - 仅文档更改不需要 changeset

5. **提交指南**

    - 编写清晰、描述性的提交消息
    - 使用约定式提交格式（例如，"feat:"、"fix:"、"docs:"）
    - 在提交中使用 #issue-number 引用相关问题

6. **提交前检查**

    - 在最新的 main 分支上变基您的分支
    - 确保您的分支构建成功
    - 再次检查所有测试是否通过
    - 检查更改中是否有任何调试代码或控制台日志

7. **Pull Request 描述**
    - 清晰描述您的更改做了什么
    - 包含测试更改的步骤
    - 列出任何破坏性更改
    - 为 UI 更改添加截图

## 贡献协议

通过提交 pull request，您同意您的贡献将在与项目相同的许可下授权（[Apache 2.0](LICENSE)）。

请记住：为 Cline Chinese 做贡献不仅仅是编写代码 - 这是成为一个正在塑造 AI 辅助开发未来的社区的一部分。让我们一起创造令人惊叹的东西！🚀
