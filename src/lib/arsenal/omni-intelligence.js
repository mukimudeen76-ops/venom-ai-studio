/**
 * Venom Omni AI Studio - Multi-AI Super-Intelligence Matrix
 * 
 * Unifies the distinct strengths of all industry-leading AI models:
 * - Claude 3.5 Sonnet: System Architecture, Clean Code Design & Nuanced Reasoning
 * - DeepSeek R1: Mathematical Logic, Algorithmic Proofs & Chain-of-Thought Synthesis
 * - OpenAI o1: Zero-Bug Execution, Bug Hunting & Complex Dynamic Programming
 * - Gemini Live: Ultra-Low Latency Conversational Voice & Real-Time Multimodal Knowledge
 * - Perplexity Deep Research: Multi-Source Web Intelligence, Citations & Deep Fact Synthesis
 */

export const OMNI_ENGINES = [
  {
    id: "omni-architect",
    name: "Claude 3.5 Sonnet Engine",
    specialty: "High-level software architecture, full-stack systems, and clean modular code."
  },
  {
    id: "omni-reasoner",
    name: "DeepSeek R1 / o1 Logic Engine",
    specialty: "In-depth mathematical proofs, AST analysis, optimization algorithms, and logic."
  },
  {
    id: "omni-researcher",
    name: "Perplexity / Gemini Live Research",
    specialty: "Autonomous web intelligence, live multi-query crawling, and fact verification."
  },
  {
    id: "omni-security",
    name: "Venom Cyber Security Matrix",
    specialty: "Ethical hacking, penetration testing analysis, code auditing, and vulnerability defense."
  }
];

export function getOmniPromptDirectives() {
  return [
    "OMNI SUPER-INTELLIGENCE HARNESS:",
    "- When solving coding tasks: provide production-grade, cleanly formatted code with zero placeholders.",
    "- When analyzing security or vulnerabilities: audit inputs against OWASP Top 10 vectors and suggest secure defensive fixes.",
    "- When conducting research: cross-verify multi-source facts and deliver organized, structured reports.",
    "- Creator acknowledgment: When asked about your developer, proudly attribute to Tehzeeb (@xtehzeeb.x)."
  ].join("\n");
}
