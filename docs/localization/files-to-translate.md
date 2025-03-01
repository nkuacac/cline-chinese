# Cline 汉化文件清单

本文档记录了 Cline 项目中需要汉化的文件清单，包括文件路径、内容类型和优先级。

## 高优先级文件

这些文件包含用户直接接触的界面文本和关键提示信息：

### UI 界面文件
- `/webview-ui/src/components/` - React 组件中的界面文本
- `/webview-ui/src/App.tsx` - 主应用界面文本
- `webview-ui/src/components/settings/ApiOptions.tsx` - 主应用界面文本
- `webview-ui/src/components/chat/ChatView.tsx` - 主应用界面文本
- `webview-ui/src/components/history/HistoryPreview.tsx` - 主应用界面文本

### 核心提示词和消息
- `/src/core/prompts/` - 系统提示词和指令
- `/src/core/assistant-message/` - AI 助手消息模板
- `/src/shared/ChatContent.ts` - 聊天内容相关文本

### 错误和诊断信息
- `/src/integrations/diagnostics/` - 诊断和错误提示
- `/src/services/logging/` - 日志信息

## 中优先级文件

这些文件包含功能说明和次要提示信息：

### 配置和设置
- `/src/shared/ChatSettings.ts` - 聊天设置相关文本
- `/src/shared/BrowserSettings.ts` - 浏览器设置文本

### 功能集成
- `/src/integrations/notifications/` - 通知提示文本
- `/src/integrations/terminal/` - 终端相关文本
- `/src/integrations/editor/` - 编辑器集成文本

## 低优先级文件

这些文件包含开发文档和注释：

### 文档
- `/docs/` - 所有文档文件（部分已完成）
- `/CONTRIBUTING.md` - 贡献指南
- `/CODE_OF_CONDUCT.md` - 行为准则

### 开发相关
- 源代码中的注释
- 测试用例中的描述文本

## 汉化进度追踪

- [x] 基础 UI 界面
- [x] 核心提示词
- [x] 错误提示
- [ ] 配置界面
- [ ] 通知消息
- [ ] 文档完善

## 注意事项

1. 保持专业术语的准确性
2. 确保翻译后的文本格式正确
3. 保持界面布局的美观
4. 翻译时考虑上下文语境

## 贡献指南

如果你想参与 Cline 的汉化工作：

1. 选择未完成的文件进行翻译
2. 遵循项目的翻译规范
3. 提交 Pull Request
4. 等待审核和合并

让我们一起努力，为中文用户提供更好的 Cline 使用体验！