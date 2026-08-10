/**
 * Nexo AI — Agent Swarm (multi-pass pipeline)
 *
 * Har agent ek kaam karta hai, phir agla agent usi kaam ko BEHTAR banata hai
 * (Anthropic-style sequential improvement). BYOK streamChatCompletion se —
 * koi DeepSeek page contact nahi, sirf user ki apni keys.
 */
import { PROVIDERS, streamChatCompletion } from "../../lib/api/ai-client.js";
import state from "../state.js";

export const AGENTS = [
  { id: "analyst", name: "🧭 Analyst", role: "Task ko samjho, plan banao, requirements nikalo." },
  { id: "architect", name: "🏗️ Architect", role: "Architecture aur structure design karo — clean, modular." },
  { id: "coder", name: "💻 Coder", role: "Production-ready code likho — complete, no stubs, comments ke saath." },
  { id: "reviewer", name: "🔍 Reviewer", role: "Code/task review karo — bugs, edge cases, security issues dhundo." },
  { id: "optimizer", name: "⚡ Optimizer", role: "Performance, efficiency, readability improve karo." },
  { id: "tester", name: "🧪 Tester", role: "Test cases banao, verify karo, potential failures dhundo." },
  { id: "documenter", name: "📚 Documenter", role: "Clear docs, README, usage guide banao." },
  { id: "polisher", name: "✨ Polisher", role: "Final polish — consistency, quality, complete answer." },
];

export const AGENT_COUNT = AGENTS.length;

function getProvider() {
  return String(state.settings.selectedProvider || "deepseek");
}
function getKey(provider) {
  const keys = state.settings.apiKeys || {};
  return String(keys[provider] || "");
}
function getModel(provider) {
  const def = PROVIDERS[provider];
  return def && def.defaultModel ? def.defaultModel : "";
}

async function agentCall(agent, task, previousOutput, onStatus) {
  const provider = getProvider();
  const key = getKey(provider);
  if (!key) {
    throw new Error("Agent swarm ke liye pehle apni API key daalo (Settings > AI Providers).");
  }
  onStatus(`${agent.name} kaam kar raha hai...`);
  const systemPrompt =
    "Tum Nexo AI ke expert agent ho: " + agent.name + ".\n" + agent.role +
    "\n\nTask: " + task +
    (previousOutput ? "\n\nPichhle agent ka output (isse BEHTAR banao):\n" + previousOutput : "") +
    "\n\nAchha, complete, actionable output do. Jhooth mat bolo, guess mat karo.";
  let full = "";
  const result = await streamChatCompletion({
    provider,
    model: getModel(provider),
    apiKey: key,
    messages: [{ role: "user", content: systemPrompt }],
    customEndpoint: String(state.settings.customEndpoint || ""),
    onChunk: (c) => { full += c; },
  });
  return (result && result.content) || full;
}

/**
 * Multi-pass swarm: saare agents sequence me chalte hain, har ek pichhle ka
 * output improve karta hai. passes > 1 ho to pura loop repeat hota hai
 * (double/triple power mode).
 */
export async function runSwarmPipeline(task, onStatus = () => {}, passes = 2) {
  let working = "";
  const logs = [];
  for (let p = 0; p < passes; p++) {
    for (const agent of AGENTS) {
      const out = await agentCall(agent, task, working, onStatus);
      working = out;
      logs.push(`[Pass ${p + 1}] ${agent.name} ✅`);
    }
  }
  onStatus("Swarm complete — final output ready.");
  return working;
}
