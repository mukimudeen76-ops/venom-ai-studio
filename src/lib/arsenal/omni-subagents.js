/**
 * Nexo AI - Omni Autonomous Subagents & Skills Arsenal
 * 
 * Powered by and integrating the best-in-class open-source agent ecosystems:
 * - jcode (1jehuang/jcode): Ultra RAM-efficient multi-session harness, semantic memory graph, Mermaid visualizer
 * - claude-video (bradautomates/claude-video): YouTube & video timeline watcher, frame extractor, Whisper transcription
 * - awesome-codex-subagents (VoltAgent): Domain-specialized autonomous subagents
 * - awesome-generative-ai-apps (Anil-matcha): Multi-modal creative studio, UGC ads, motion graphics, video pipelines
 * - odysseus (odysseus-dev/odysseus): Deep research synthesis, multi-model consensus, document editor, task scheduler
 * 
 * Masterminded & Created by Tehzeeb (Instagram: @xtehzeeb.x | Support: xtehzeeb.x7@gmail.com)
 */

export const SUBAGENTS = [
  {
    id: "subagent-architect",
    name: "Architect Subagent (Claude 3.5 Sonnet / o1)",
    role: "System Architecture & Engineering Design",
    description: "Designs scalable microservices, database schemas, API specs, and clean modular code architectures with 0 placeholders.",
    skills: ["system-design", "domain-driven-design", "clean-architecture", "database-indexing", "cloud-infrastructure"]
  },
  {
    id: "subagent-fullstack",
    name: "Fullstack Engineering Subagent",
    role: "End-to-End Implementation",
    description: "Builds modern frontend (Svelte, React, Vue, Flutter) and backend (Node.js, Rust, Go, Python, FastAPI) applications.",
    skills: ["svelte5", "react19", "flutter", "fastapi", "typescript", "rust-harness", "rest-api", "websockets"]
  },
  {
    id: "subagent-debugger",
    name: "Systematic Debugger & Self-Healing Subagent",
    role: "Root Cause Analysis & Auto-Remedy",
    description: "Performs methodical debugging, AST error trace inspection, reproduction test writing, and automated patch application.",
    skills: ["ast-analysis", "stack-trace-parsing", "triage", "unit-testing", "self-healing-loop"]
  },
  {
    id: "subagent-security",
    name: "Security & Penetration Audit Subagent",
    role: "Cybersecurity & Token Vault Protection",
    description: "Audits code for OWASP Top 10 vulnerabilities, intercepts exposed credentials into local encrypted Token Vault, tests XSS/CSRF/SQLi defense.",
    skills: ["token-vault", "credential-masking", "owasp-audit", "jwt-inspector", "dependency-vulnerability-scan"]
  },
  {
    id: "subagent-video-vision",
    name: "Video Vision & Media Subagent (claude-video)",
    role: "Video Understanding & Frame Intelligence",
    description: "Inspects YouTube videos, extracts timeline frames, parses captions/Whisper transcripts, and delivers multimodal scene understanding.",
    skills: ["youtube-transcript", "frame-extraction", "scene-ocr", "timeline-analysis", "audio-speech-to-text"]
  },
  {
    id: "subagent-designer",
    name: "UI/UX & Creative Media Subagent (Open-AI-Design-Agent)",
    role: "Design System, HIG & Motion Graphics",
    description: "Designs according to Apple HIG, Material Design 3, WCAG 2.2 accessibility, produces interactive SVG visualizations and CSS animations.",
    skills: ["apple-hig", "material3", "interactive-visualizer", "svg-simulations", "motion-graphics", "theme-builder"]
  },
  {
    id: "subagent-deep-research",
    name: "Deep Research Synthesis Subagent (Odysseus Engine)",
    role: "Multi-Source Deep Web Research & Synthesis",
    description: "Conducts multi-step autonomous deep research across academic and real-time web sources, fact-checks, and writes cited analytical reports.",
    skills: ["multi-query-crawler", "readability-extraction", "academic-citations", "consensus-synthesis", "markdown-report"]
  },
  {
    id: "subagent-genai-studio",
    name: "Generative Media & Storyboard Subagent (MuAPI Studio)",
    role: "Multi-Modal AI Prompts & Video Workflows",
    description: "Crafts optimized prompts and pipelines for image/video generation (Flux 3, Midjourney v7, Sora, Veo 3.1, Seedance 2, Runway Gen-3).",
    skills: ["flux-prompting", "sora-video-storyboard", "ugc-ad-pipeline", "micro-drama-scripting", "text-to-video-motion"]
  },
  {
    id: "subagent-jcode-harness",
    name: "JCode High-Performance Memory Harness",
    role: "RAM-Efficient Multi-Session Context & Memory",
    description: "Maintains semantic memory graph, automatic recall via cosine similarity, and zero-token-waste context compaction.",
    skills: ["semantic-memory", "context-compaction", "mermaid-diagrams", "multi-session-sync", "mcp-protocol"]
  }
];

/**
 * Returns formatted subagent prompt guidelines to inject into system prompt
 */
export function getSubagentsPromptBlock() {
  return [
    "═══ NEXO AI OMNI SUBAGENT & SKILLS ARSENAL ═══",
    "You have access to 9 specialized autonomous subagents inspired by top AI engineering engines (jcode, claude-video, VoltAgent, awesome-generative-ai, odysseus):",
    ...SUBAGENTS.map((s, idx) => `${idx + 1}. [${s.name}]: ${s.description}`),
    "",
    "When a user task requires deep specialization (architecture, debugging, video analysis, UI/UX, deep research, generative media, or git execution), activate the relevant subagent capabilities seamlessly and deliver complete, production-grade results."
  ].join("\n");
}
