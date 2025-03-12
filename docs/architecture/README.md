```markdown
# Cline Chinese Extension Architecture

This directory contains the architecture documentation for the Cline Chinese VSCode extension.

## Extension Architecture Diagram

The [extension-architecture.mmd](./extension-architecture.mmd) file contains a Mermaid diagram illustrating the high-level architecture of the Cline Chinese extension. This diagram explains:

1. **Core Extension**
   - Extension entry points and main classes
   - State management using VSCode's global state and key storage
   - Core business logic in the Cline class

2. **Webview UI**
   - React-based user interface
   - State management using ExtensionStateContext
   - Component hierarchy

3. **Storage**
   - Task-specific history and state storage
   - File change checkpoints based on Git

4. **Data Flow**
   - Data flow among core extension components
   - Webview UI data flow
   - Bidirectional communication between core and webview

## Viewing the Diagram

To view the diagram:
1. Install the Mermaid diagram viewer extension in VSCode
2. Open extension-architecture.mmd
3. Use the extension's preview feature to render the diagram

You can also view the diagram on GitHub, which has built-in Mermaid rendering support.

## Color Scheme

The diagram uses a high contrast color scheme for better visibility:
- Pink (#ff0066): Global state and key storage components
- Blue (#0066ff): Extension state context
- Green (#00cc66): Cline provider
- All components use white text for maximum readability
```