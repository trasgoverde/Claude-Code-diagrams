// Types for our 3D graph
export interface GraphNode {
  id: string;
  name: string;
  group: string;
  category: string;
  description?: string;
  val?: number; // Node size
  color?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number;
  color?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Color palette matching the Mermaid diagrams
export const categoryColors: Record<string, string> = {
  entry: "#17a2b8",      // Cyan - Entry points
  ui: "#6f42c1",         // Purple - UI components
  core: "#e83e8c",       // Pink - Core engine
  tool: "#28a745",       // Green - Tools
  context: "#fd7e14",    // Orange - Context management
  permission: "#dc3545", // Red - Permissions
  state: "#4a9eff",      // Blue - State management
  extension: "#ffc107",  // Yellow - Extensions
  external: "#888888",   // Gray - External services
  process: "#4a9eff",    // Blue - Process nodes
  decision: "#ffc107",   // Yellow - Decision nodes
  api: "#28a745",        // Green - API nodes
  response: "#fd7e14",   // Orange - Response nodes
};

// Build the complete graph from all diagrams
export function buildGraphData(): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeMap = new Map<string, boolean>();

  const addNode = (node: GraphNode) => {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, true);
      nodes.push(node);
    }
  };

  const addLink = (source: string, target: string, value = 1) => {
    links.push({ source, target, value, color: "#4a9eff44" });
  };

  // ============================================
  // 1. System Overview Nodes
  // ============================================
  
  // Entry Points
  addNode({ id: "cli", name: "CLI Entry", group: "System Overview", category: "entry", description: "main.tsx — 804KB", val: 15 });
  addNode({ id: "sdk", name: "SDK Entry", group: "System Overview", category: "entry", description: "Programmatic API", val: 15 });
  addNode({ id: "mcp_server", name: "MCP Server", group: "System Overview", category: "entry", description: "Expose as MCP", val: 15 });

  // UI Layer
  addNode({ id: "repl", name: "REPL.tsx", group: "System Overview", category: "ui", description: "896KB Interactive Terminal Shell", val: 20 });
  addNode({ id: "components", name: "113 Components", group: "System Overview", category: "ui", description: "Messages, Diffs, Dialogs", val: 18 });
  addNode({ id: "hooks", name: "83 React Hooks", group: "System Overview", category: "ui", description: "Permissions, Input, IDE", val: 18 });

  // Core Engine
  addNode({ id: "query_engine", name: "QueryEngine.ts", group: "System Overview", category: "core", description: "Session Lifecycle Owner", val: 22 });
  addNode({ id: "query", name: "query.ts", group: "System Overview", category: "core", description: "1730 lines — Agentic Loop", val: 25 });
  addNode({ id: "claude", name: "claude.ts", group: "System Overview", category: "core", description: "3420 lines — Anthropic API Client", val: 25 });

  // Tool System
  addNode({ id: "tool_interface", name: "Tool Interface", group: "System Overview", category: "tool", description: "Tool.ts", val: 15 });
  addNode({ id: "builtin_tools", name: "42 Built-in Tools", group: "System Overview", category: "tool", val: 18 });
  addNode({ id: "mcp_tools", name: "MCP Tools", group: "System Overview", category: "tool", description: "Dynamic", val: 15 });
  addNode({ id: "tool_orchestration", name: "Tool Orchestration", group: "System Overview", category: "tool", description: "Parallel Execution", val: 16 });

  // Context Management
  addNode({ id: "compaction", name: "Compaction Pipeline", group: "System Overview", category: "context", description: "snip / micro / auto / reactive / collapse", val: 18 });

  // Permission System
  addNode({ id: "rules", name: "Allow + Deny Rules", group: "System Overview", category: "permission", val: 14 });
  addNode({ id: "hooks_perm", name: "PreToolUse Hooks", group: "System Overview", category: "permission", val: 12 });
  addNode({ id: "classifier", name: "Auto-mode Classifier", group: "System Overview", category: "permission", val: 14 });

  // State Management
  addNode({ id: "app_state", name: "AppState Store", group: "System Overview", category: "state", description: "Immutable — 50+ fields", val: 18 });
  addNode({ id: "session_storage", name: "Session Storage", group: "System Overview", category: "state", description: "Transcripts + Resume", val: 14 });
  addNode({ id: "config", name: "Config Layer", group: "System Overview", category: "state", description: "Global / Project / CLAUDE.md", val: 14 });

  // Extensions
  addNode({ id: "skills", name: "Skills", group: "System Overview", category: "extension", val: 12 });
  addNode({ id: "plugins", name: "Plugins", group: "System Overview", category: "extension", val: 12 });
  addNode({ id: "agents", name: "Sub-agents + Swarms", group: "System Overview", category: "extension", val: 14 });

  // External
  addNode({ id: "anthropic_api", name: "Anthropic Messages API", group: "System Overview", category: "external", val: 16 });
  addNode({ id: "external_mcp", name: "External MCP Servers", group: "System Overview", category: "external", val: 12 });
  addNode({ id: "growthbook", name: "GrowthBook + Statsig", group: "System Overview", category: "external", val: 10 });

  // System Overview Links
  addLink("cli", "repl");
  addLink("sdk", "query_engine");
  addLink("mcp_server", "query_engine");
  addLink("repl", "components");
  addLink("repl", "hooks");
  addLink("repl", "query_engine");
  addLink("repl", "app_state");
  addLink("query_engine", "query");
  addLink("query", "claude");
  addLink("query", "compaction");
  addLink("query", "tool_orchestration");
  addLink("claude", "anthropic_api");
  addLink("claude", "growthbook");
  addLink("tool_orchestration", "tool_interface");
  addLink("tool_interface", "builtin_tools");
  addLink("tool_interface", "mcp_tools");
  addLink("builtin_tools", "rules");
  addLink("builtin_tools", "hooks_perm");
  addLink("mcp_tools", "rules");
  addLink("rules", "classifier");
  addLink("query_engine", "session_storage");
  addLink("repl", "config");
  addLink("skills", "tool_interface");
  addLink("plugins", "tool_interface");
  addLink("plugins", "external_mcp");
  addLink("agents", "query");
  addLink("external_mcp", "mcp_tools");

  // ============================================
  // 2. Tool System Detail Nodes
  // ============================================
  
  // File Operations
  addNode({ id: "file_read", name: "FileRead", group: "Tool System", category: "tool", val: 10 });
  addNode({ id: "file_write", name: "FileWrite", group: "Tool System", category: "tool", val: 10 });
  addNode({ id: "file_edit", name: "FileEdit", group: "Tool System", category: "tool", val: 10 });
  addNode({ id: "glob", name: "Glob", group: "Tool System", category: "tool", val: 10 });
  addNode({ id: "grep", name: "Grep", group: "Tool System", category: "tool", val: 10 });
  addNode({ id: "notebook_edit", name: "NotebookEdit", group: "Tool System", category: "tool", val: 8 });

  // Execution
  addNode({ id: "bash", name: "Bash", group: "Tool System", category: "tool", val: 12 });
  addNode({ id: "powershell", name: "PowerShell", group: "Tool System", category: "tool", val: 10 });

  // Web
  addNode({ id: "web_fetch", name: "WebFetch", group: "Tool System", category: "tool", val: 10 });
  addNode({ id: "web_search", name: "WebSearch", group: "Tool System", category: "tool", val: 10 });

  // Agent Tools
  addNode({ id: "agent_tool", name: "Agent Tool", group: "Tool System", category: "tool", description: "Spawn sub-agent", val: 12 });
  addNode({ id: "task_create", name: "TaskCreate", group: "Tool System", category: "tool", val: 8 });
  addNode({ id: "task_get", name: "TaskGet", group: "Tool System", category: "tool", val: 8 });
  addNode({ id: "send_message", name: "SendMessage", group: "Tool System", category: "tool", val: 8 });

  // Meta Tools
  addNode({ id: "ask_user", name: "AskUserQuestion", group: "Tool System", category: "tool", val: 10 });
  addNode({ id: "skill_tool", name: "SkillTool", group: "Tool System", category: "tool", val: 10 });
  addNode({ id: "todo_write", name: "TodoWrite", group: "Tool System", category: "tool", val: 8 });
  addNode({ id: "plan_mode", name: "EnterPlanMode", group: "Tool System", category: "tool", val: 10 });

  // Orchestration
  addNode({ id: "run_tools", name: "runTools", group: "Tool System", category: "tool", description: "Parallel dispatch", val: 14 });
  addNode({ id: "streaming_executor", name: "StreamingToolExecutor", group: "Tool System", category: "tool", val: 12 });
  addNode({ id: "tool_execution", name: "toolExecution.ts", group: "Tool System", category: "tool", description: "60KB", val: 14 });
  addNode({ id: "tool_hooks", name: "toolHooks.ts", group: "Tool System", category: "tool", val: 10 });

  // Tool System Links
  addLink("tool_interface", "file_read");
  addLink("tool_interface", "file_write");
  addLink("tool_interface", "file_edit");
  addLink("tool_interface", "glob");
  addLink("tool_interface", "grep");
  addLink("tool_interface", "bash");
  addLink("tool_interface", "powershell");
  addLink("tool_interface", "web_fetch");
  addLink("tool_interface", "web_search");
  addLink("tool_interface", "agent_tool");
  addLink("tool_interface", "ask_user");
  addLink("tool_interface", "skill_tool");
  addLink("tool_interface", "plan_mode");
  addLink("run_tools", "streaming_executor");
  addLink("run_tools", "tool_execution");
  addLink("tool_execution", "tool_hooks");

  // ============================================
  // 3. Permission Flow Nodes
  // ============================================
  
  addNode({ id: "perm_entry", name: "Tool Call Arrives", group: "Permission System", category: "process", val: 12 });
  addNode({ id: "deny_check", name: "Deny Rules Check", group: "Permission System", category: "decision", val: 10 });
  addNode({ id: "allow_check", name: "Allow Rules Check", group: "Permission System", category: "decision", val: 10 });
  addNode({ id: "tool_check_perms", name: "Tool checkPermissions", group: "Permission System", category: "decision", val: 10 });
  addNode({ id: "pretool_hooks", name: "PreToolUse Hooks", group: "Permission System", category: "decision", val: 10 });
  addNode({ id: "auto_classifier", name: "Auto-mode Classifier", group: "Permission System", category: "decision", val: 12 });
  addNode({ id: "user_dialog", name: "User Permission Dialog", group: "Permission System", category: "ui", val: 10 });
  addNode({ id: "perm_allow", name: "ALLOW", group: "Permission System", category: "tool", val: 14 });
  addNode({ id: "perm_deny", name: "DENY", group: "Permission System", category: "permission", val: 14 });

  // Permission Modes
  addNode({ id: "default_mode", name: "DEFAULT MODE", group: "Permission Modes", category: "state", val: 12 });
  addNode({ id: "plan_mode_perm", name: "PLAN MODE", group: "Permission Modes", category: "extension", val: 12 });
  addNode({ id: "auto_mode", name: "AUTO MODE", group: "Permission Modes", category: "entry", val: 12 });
  addNode({ id: "bypass_mode", name: "BYPASS MODE", group: "Permission Modes", category: "permission", val: 12 });

  // Permission Links
  addLink("perm_entry", "deny_check");
  addLink("deny_check", "perm_deny");
  addLink("deny_check", "allow_check");
  addLink("allow_check", "perm_allow");
  addLink("allow_check", "tool_check_perms");
  addLink("tool_check_perms", "pretool_hooks");
  addLink("tool_check_perms", "perm_deny");
  addLink("pretool_hooks", "perm_allow");
  addLink("pretool_hooks", "perm_deny");
  addLink("pretool_hooks", "auto_classifier");
  addLink("auto_classifier", "perm_allow");
  addLink("auto_classifier", "user_dialog");
  addLink("user_dialog", "perm_allow");
  addLink("user_dialog", "perm_deny");
  addLink("default_mode", "plan_mode_perm");
  addLink("plan_mode_perm", "default_mode");
  addLink("default_mode", "auto_mode");
  addLink("auto_mode", "default_mode");
  addLink("default_mode", "bypass_mode");

  // ============================================
  // 4. Context/Compaction Pipeline Nodes
  // ============================================
  
  addNode({ id: "raw_messages", name: "Raw Message History", group: "Compaction Pipeline", category: "state", val: 14 });
  addNode({ id: "snip_compact", name: "SNIP COMPACT", group: "Compaction Pipeline", category: "tool", description: "Sliding window", val: 12 });
  addNode({ id: "micro_compact", name: "MICRO COMPACT", group: "Compaction Pipeline", category: "entry", description: "Truncate tool results", val: 12 });
  addNode({ id: "auto_compact", name: "AUTO COMPACT", group: "Compaction Pipeline", category: "extension", description: "Summarize via API", val: 14 });
  addNode({ id: "context_collapse", name: "CONTEXT COLLAPSE", group: "Compaction Pipeline", category: "ui", description: "Granular preservation", val: 12 });
  addNode({ id: "ready_messages", name: "Messages Ready", group: "Compaction Pipeline", category: "state", val: 14 });
  addNode({ id: "reactive_compact", name: "REACTIVE COMPACT", group: "Compaction Pipeline", category: "permission", description: "Emergency on 413", val: 12 });

  // Token Budget States
  addNode({ id: "token_normal", name: "NORMAL", group: "Token Budget", category: "tool", description: "Within limits", val: 10 });
  addNode({ id: "token_warning", name: "WARNING", group: "Token Budget", category: "extension", description: "Context > 80%", val: 10 });
  addNode({ id: "token_critical", name: "CRITICAL", group: "Token Budget", category: "context", description: "Context > 95%", val: 10 });
  addNode({ id: "token_blocking", name: "BLOCKING", group: "Token Budget", category: "permission", description: "Context > 98%", val: 10 });

  // Compaction Links
  addLink("raw_messages", "snip_compact");
  addLink("snip_compact", "micro_compact");
  addLink("micro_compact", "auto_compact");
  addLink("auto_compact", "context_collapse");
  addLink("context_collapse", "ready_messages");
  addLink("ready_messages", "reactive_compact");
  addLink("reactive_compact", "ready_messages");
  addLink("token_normal", "token_warning");
  addLink("token_warning", "token_critical");
  addLink("token_critical", "auto_compact");
  addLink("token_critical", "token_blocking");

  // ============================================
  // 5. State Management Detail Nodes
  // ============================================
  
  addNode({ id: "core_session", name: "Core Session State", group: "State Management", category: "state", val: 14 });
  addNode({ id: "main_model", name: "mainLoopModel", group: "State Management", category: "core", val: 8 });
  addNode({ id: "thinking_enabled", name: "thinkingEnabled", group: "State Management", category: "core", val: 8 });
  addNode({ id: "fast_mode", name: "fastMode", group: "State Management", category: "core", val: 8 });
  addNode({ id: "effort_value", name: "effortValue", group: "State Management", category: "core", val: 8 });
  addNode({ id: "settings_json", name: "SettingsJson", group: "State Management", category: "state", val: 10 });

  addNode({ id: "perm_state", name: "Permission State", group: "State Management", category: "permission", val: 14 });
  addNode({ id: "mcp_state", name: "MCP State", group: "State Management", category: "entry", val: 14 });
  addNode({ id: "task_state", name: "Background Tasks", group: "State Management", category: "tool", val: 14 });
  addNode({ id: "ui_state", name: "UI State", group: "State Management", category: "ui", val: 14 });
  addNode({ id: "history_state", name: "History Tracking", group: "State Management", category: "context", val: 14 });

  addNode({ id: "set_app_state", name: "setAppState", group: "State Management", category: "core", val: 12 });
  addNode({ id: "on_change_state", name: "onChangeAppState", group: "State Management", category: "core", val: 12 });

  // State Links
  addLink("app_state", "core_session");
  addLink("app_state", "perm_state");
  addLink("app_state", "mcp_state");
  addLink("app_state", "task_state");
  addLink("app_state", "ui_state");
  addLink("app_state", "history_state");
  addLink("core_session", "main_model");
  addLink("core_session", "thinking_enabled");
  addLink("core_session", "fast_mode");
  addLink("core_session", "effort_value");
  addLink("core_session", "settings_json");
  addLink("set_app_state", "app_state");
  addLink("on_change_state", "app_state");

  // ============================================
  // 6. Extension System Nodes
  // ============================================
  
  addNode({ id: "bundled_skills", name: "Bundled Skills", group: "Extensions", category: "entry", val: 10 });
  addNode({ id: "user_skills", name: "User Skills", group: "Extensions", category: "extension", description: ".claude/skills/*.md", val: 10 });
  addNode({ id: "project_skills", name: "Project Skills", group: "Extensions", category: "extension", val: 10 });
  addNode({ id: "skill_loader", name: "loadSkillsDir.ts", group: "Extensions", category: "state", val: 10 });

  addNode({ id: "managed_plugins", name: "Managed Plugins", group: "Extensions", category: "extension", val: 10 });
  addNode({ id: "installed_plugins", name: "Installed Plugins", group: "Extensions", category: "extension", val: 10 });
  addNode({ id: "builtin_plugins", name: "Built-in Plugins", group: "Extensions", category: "extension", val: 10 });
  addNode({ id: "plugin_loader", name: "pluginLoader.ts", group: "Extensions", category: "state", val: 10 });

  addNode({ id: "sub_agents", name: "Sub-agents", group: "Extensions", category: "ui", description: "Forked context", val: 12 });
  addNode({ id: "coordinator", name: "Coordinator Mode", group: "Extensions", category: "ui", val: 12 });
  addNode({ id: "swarms", name: "Swarms", group: "Extensions", category: "ui", description: "Multi-process via tmux", val: 12 });
  addNode({ id: "forked_agents", name: "Forked Agents", group: "Extensions", category: "ui", val: 12 });

  addNode({ id: "pre_hook", name: "PreToolUse Hook", group: "Extensions", category: "context", val: 10 });
  addNode({ id: "post_hook", name: "PostToolUse Hook", group: "Extensions", category: "context", val: 10 });
  addNode({ id: "session_hooks", name: "Session Hooks", group: "Extensions", category: "context", val: 10 });

  addNode({ id: "command_registry", name: "Command Registry", group: "Extensions", category: "tool", val: 14 });

  // Extension Links
  addLink("skills", "bundled_skills");
  addLink("skills", "user_skills");
  addLink("skills", "project_skills");
  addLink("bundled_skills", "skill_loader");
  addLink("user_skills", "skill_loader");
  addLink("project_skills", "skill_loader");
  addLink("skill_loader", "command_registry");
  addLink("plugins", "managed_plugins");
  addLink("plugins", "installed_plugins");
  addLink("plugins", "builtin_plugins");
  addLink("managed_plugins", "plugin_loader");
  addLink("installed_plugins", "plugin_loader");
  addLink("builtin_plugins", "plugin_loader");
  addLink("plugin_loader", "command_registry");
  addLink("agents", "sub_agents");
  addLink("agents", "coordinator");
  addLink("agents", "swarms");
  addLink("agents", "forked_agents");
  addLink("sub_agents", "query");
  addLink("coordinator", "query");
  addLink("swarms", "query");
  addLink("pre_hook", "tool_interface");
  addLink("post_hook", "tool_interface");

  // ============================================
  // 7. API Lifecycle Nodes
  // ============================================
  
  addNode({ id: "api_query", name: "query.ts Call", group: "API Lifecycle", category: "core", val: 12 });
  addNode({ id: "api_claude", name: "claude.ts Handler", group: "API Lifecycle", category: "core", val: 12 });
  addNode({ id: "with_retry", name: "withRetry Wrapper", group: "API Lifecycle", category: "tool", val: 10 });
  addNode({ id: "anthropic_client", name: "AnthropicClient", group: "API Lifecycle", category: "external", val: 12 });
  addNode({ id: "sse_stream", name: "SSE Event Stream", group: "API Lifecycle", category: "response", val: 14 });
  addNode({ id: "rate_limit", name: "429 Rate Limited", group: "API Lifecycle", category: "permission", val: 8 });
  addNode({ id: "overloaded", name: "529 Overloaded", group: "API Lifecycle", category: "permission", val: 8 });
  addNode({ id: "auth_error", name: "401 Auth Error", group: "API Lifecycle", category: "permission", val: 8 });
  addNode({ id: "usage_tracking", name: "Usage Tracking", group: "API Lifecycle", category: "state", val: 10 });
  addNode({ id: "cache_breaks", name: "Prompt Cache Breaks", group: "API Lifecycle", category: "context", val: 10 });

  // API Lifecycle Links
  addLink("api_query", "api_claude");
  addLink("api_claude", "with_retry");
  addLink("with_retry", "anthropic_client");
  addLink("anthropic_client", "anthropic_api");
  addLink("anthropic_api", "sse_stream");
  addLink("anthropic_api", "rate_limit");
  addLink("anthropic_api", "overloaded");
  addLink("anthropic_api", "auth_error");
  addLink("rate_limit", "with_retry");
  addLink("overloaded", "with_retry");
  addLink("sse_stream", "api_claude");
  addLink("api_claude", "usage_tracking");
  addLink("api_claude", "cache_breaks");

  return { nodes, links };
}

// Get unique groups for filtering
export function getGroups(data: GraphData): string[] {
  const groups = new Set<string>();
  data.nodes.forEach((node) => groups.add(node.group));
  return Array.from(groups).sort();
}

// Get unique categories for coloring
export function getCategories(data: GraphData): string[] {
  const categories = new Set<string>();
  data.nodes.forEach((node) => categories.add(node.category));
  return Array.from(categories).sort();
}
