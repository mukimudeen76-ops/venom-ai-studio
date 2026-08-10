<script>
  // Nexo AI — Standalone Chat (BYOK): user ki apni API keys se full chat,
  // deep research, aur agent swarm. Kisi bhi DeepSeek page se contact NAHI.
  import { onMount } from "svelte";
  import appState from "../state.js";
  import { PROVIDERS, streamChatCompletion } from "../../lib/api/ai-client.js";
  import { searchWeb } from "../files/search-reader.js";
  import { fetchAndConvertWebPage } from "../files/web-reader.js";
  import { AGENTS, runSwarmPipeline } from "../agent/swarm-agents.js";

  let messages = $state([
    { role: "assistant", text: "Nexo AI online. Apni API key Settings me daalo, phir kuch bhi poochho — chat, deep research, agents, sab ready. 🕸️" },
  ]);
  let input = $state("");
  let busy = $state(false);
  let mode = $state("chat"); // chat | research | swarm
  let status = $state("");
  let streaming = $state("");
  let abortCtrl = $state(null);

  function getProvider() {
    return String(appState.settings.selectedProvider || "deepseek");
  }
  function getKey(provider) {
    const keys = appState.settings.apiKeys || {};
    return String(keys[provider] || "");
  }
  function getModel(provider) {
    const def = PROVIDERS[provider];
    if (def && def.defaultModel) return def.defaultModel;
    return "";
  }

  function push(role, text) {
    messages = [...messages, { role, text }];
  }

  async function sendChat(text) {
    const provider = getProvider();
    const key = getKey(provider);
    if (!key) {
      push("assistant", "Pehle apni API key daalo — Settings ⚙️ > AI Providers (DeepSeek/OpenAI/Claude/Gemini/Groq/APILayer/custom).");
      return;
    }
    busy = true;
    status = "Sending to " + provider + "...";
    push("user", text);
    abortCtrl = new AbortController();
    streaming = "";
    try {
      const history = messages
        .filter((m) => m.role !== "system")
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.text }));
      let full = "";
      const result = await streamChatCompletion({
        provider,
        model: getModel(provider),
        apiKey: key,
        messages: history,
        customEndpoint: String(appState.settings.customEndpoint || ""),
        onChunk: (chunk) => {
          streaming += chunk;
          // throttle UI updates
        },
        signal: abortCtrl.signal,
      });
      full = result.content || streaming;
      push("assistant", full || "(empty response)");
      streaming = "";
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      push("assistant", "❌ " + msg);
      streaming = "";
    } finally {
      busy = false;
      status = "";
      abortCtrl = null;
    }
  }

  // ── DEEP RESEARCH (standalone): searchWeb + fetch — free, no DeepSeek ──
  async function sendResearch(query) {
    busy = true;
    status = "🔍 Deep research chalu: " + query;
    push("user", "Deep research: " + query);
    push("assistant", "Planning research steps...");
    try {
      const plan = [
        { query: query + " overview", note: "Overview" },
        { query: query + " latest 2026", note: "Latest" },
        { query: query + " key details", note: "Details" },
      ];
      let report = "";
      for (let i = 0; i < plan.length; i++) {
        status = `Step ${i + 1}/${plan.length}: ${plan[i].note}`;
        const results = await searchWeb(plan[i].query, 2, () => {});
        report += `\n\n## ${plan[i].note}\n${results || "(no results)"}`;
      }
      push("assistant", report.trim() || "Koi result nahi mila.");
    } catch (e) {
      push("assistant", "❌ Deep research fail: " + (e && e.message ? e.message : e));
    } finally {
      busy = false;
      status = "";
    }
  }

  // ── AGENT SWARM: har agent kaam ko behtar banata hai ──
  async function sendSwarm(task) {
    busy = true;
    status = "🧠 Agent swarm chalu: " + task;
    push("user", "Agent swarm: " + task);
    try {
      const report = await runSwarmPipeline(task, (s) => {
        status = s;
        push("assistant", s);
      });
      push("assistant", report);
    } catch (e) {
      push("assistant", "❌ Swarm fail: " + (e && e.message ? e.message : e));
    } finally {
      busy = false;
      status = "";
    }
  }

  function onSend() {
    const text = input.trim();
    if (!text || busy) return;
    input = "";
    if (mode === "research") sendResearch(text);
    else if (mode === "swarm") sendSwarm(text);
    else sendChat(text);
  }

  function stopGen() {
    if (abortCtrl) {
      abortCtrl.abort();
      abortCtrl = null;
      busy = false;
      status = "Stopped.";
    }
  }

  // ── TERMINAL: sandbox me JS commands (safe eval) ──
  let termInput = $state("");
  let termOut = $state(["Nexo Terminal — JS commands ready. Try: 1+1 | fetch('https://...') | document.title"]);
  let sandboxIframe = null;

  function ensureSandbox() {
    if (sandboxIframe) return sandboxIframe;
    const url = typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL ? chrome.runtime.getURL("sandbox.html") : "sandbox.html";
    sandboxIframe = document.createElement("iframe");
    sandboxIframe.style.display = "none";
    sandboxIframe.src = url;
    document.body.appendChild(sandboxIframe);
    return sandboxIframe;
  }

  function runTerminal() {
    const cmd = termInput.trim();
    if (!cmd) return;
    termInput = "";
    termOut = [...termOut, "> " + cmd];
    const frame = ensureSandbox();
    const listener = (e) => {
      if (e.data && (e.data.type === "TERMINAL_RESULT" || e.data.type === "TERMINAL_ERROR")) {
        window.removeEventListener("message", listener);
        const out = e.data.type === "TERMINAL_RESULT" ? e.data.output : "❌ " + e.data.error;
        termOut = [...termOut, String(out)];
      }
    };
    window.addEventListener("message", listener);
    setTimeout(() => {
      try {
        frame.contentWindow.postMessage({ type: "TERMINAL", code: cmd, id: Date.now() }, "*");
      } catch (e) {
        termOut = [...termOut, "❌ " + e.message];
        window.removeEventListener("message", listener);
      }
    }, 300);
  }

  onMount(() => {
    // make sure settings are loaded
    if (appState.settings && appState.settings.selectedProvider && !appState.settings.apiKeys) {
      appState.settings.apiKeys = {};
    }
  });
</script>

<div class="nexo-standalone" style="height:100vh; display:flex; flex-direction:column; background:#04060B; color:#E2E8F0; font-family: system-ui, sans-serif;">
  <!-- Header -->
  <div style="display:flex; align-items:center; gap:10px; padding:12px 16px; border-bottom:1px solid rgba(139,92,246,0.3); background:rgba(10,12,30,0.8);">
    <div style="width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#22D3EE,#818CF8,#E879F9);display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;font-size:16px;">N</div>
    <div style="flex:1;">
      <div style="font-weight:700; font-size:15px; letter-spacing:0.5px;">NEXO AI <span style="font-size:10px;color:#22D3EE;border:1px solid rgba(34,211,238,0.4);border-radius:6px;padding:1px 5px;margin-left:6px;">BYOK</span></div>
      <div style="font-size:10px;color:rgba(255,255,255,0.45);">Full-power studio · apni keys, apna control</div>
    </div>
    <select bind:value={appState.settings.selectedProvider} style="background:#0B0F1E;border:1px solid rgba(139,92,246,0.4);color:#C084FC;border-radius:8px;padding:5px 8px;font-size:12px;">
      {#each Object.entries(PROVIDERS) as [id, pr]}
        <option value={id}>{pr.name}</option>
      {/each}
    </select>
  </div>

  <!-- Mode tabs -->
  <div style="display:flex; gap:8px; padding:8px 16px; border-bottom:1px solid rgba(255,255,255,0.08);">
    {#each [
      { id: "chat", label: "💬 Chat" },
      { id: "research", label: "🔍 Deep Research" },
      { id: "swarm", label: "🧠 Agent Swarm" },
    ] as t}
      <button
        type="button"
        onclick={() => (mode = t.id)}
        style="padding:6px 14px;border-radius:10px;border:1px solid {mode === t.id ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.12)'};background:{mode === t.id ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.04)'};color:{mode === t.id ? '#22D3EE' : 'rgba(255,255,255,0.6)'};font-size:12px;font-weight:600;cursor:pointer;"
      >{t.label}</button>
    {/each}
    {#if busy}
      <button type="button" onclick={stopGen} style="margin-left:auto;padding:6px 14px;border-radius:10px;border:1px solid rgba(248,113,113,0.5);background:rgba(248,113,113,0.1);color:#F87171;font-size:12px;cursor:pointer;">⏹ Stop</button>
    {/if}
  </div>

  {#if status}
    <div style="padding:6px 16px;font-size:11px;color:#22D3EE;background:rgba(34,211,238,0.06);border-bottom:1px solid rgba(34,211,238,0.2);font-family:monospace;">{status}</div>
  {/if}

  <!-- Messages -->
  <div style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px;">
    {#each messages as m}
      <div style="max-width:88%; align-self:{m.role === 'user' ? 'flex-end' : 'flex-start'}; background:{m.role === 'user' ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.05)'}; border:1px solid {m.role === 'user' ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.08)'}; border-radius:14px; padding:10px 14px; font-size:13px; line-height:1.55; white-space:pre-wrap; word-break:break-word;">
        {m.text}
      </div>
    {/each}
    {#if streaming}
      <div style="align-self:flex-start; background:rgba(255,255,255,0.04); border-radius:14px; padding:10px 14px; font-size:13px; color:#67E8F9;">{streaming}▌</div>
    {/if}
  </div>

  {#if mode === "terminal"}
    <div style="flex:1; overflow-y:auto; padding:12px 16px; background:#020408; font-family:monospace; font-size:12px; color:#67E8F9; display:flex; flex-direction:column; gap:2px;">
      {#each termOut as line}
        <div style="white-space:pre-wrap; word-break:break-word;">{line}</div>
      {/each}
    </div>
    <div style="display:flex; gap:8px; padding:12px 16px; border-top:1px solid rgba(34,211,238,0.2); background:rgba(10,12,30,0.9);">
      <span style="color:#E879F9; font-family:monospace; font-size:13px; padding-top:6px;">&#10095;</span>
      <input
        bind:value={termInput}
        onkeydown={(e) => { if (e.key === "Enter") runTerminal(); }}
        placeholder="JS command... (e.g. 1+1, fetch, document.title)"
        style="flex:1; background:transparent; border:none; color:#67E8F9; font-family:monospace; font-size:13px; outline:none;"
      />
      <button type="button" onclick={runTerminal} style="padding:0 16px;border-radius:8px;border:1px solid rgba(34,211,238,0.5);background:rgba(34,211,238,0.12);color:#22D3EE;font-weight:700;cursor:pointer;">Run</button>
    </div>
  {:else}
  <!-- Input -->
  <div style="display:flex; gap:8px; padding:12px 16px; border-top:1px solid rgba(255,255,255,0.08); background:rgba(10,12,30,0.8);">
    <textarea
      bind:value={input}
      placeholder={mode === "research" ? "Deep research ka topic likho..." : mode === "swarm" ? "Agent swarm ke liye task likho..." : "Message likho (Enter = bhejo)..."}
      onkeydown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
      style="flex:1; background:#0B0F1E; border:1px solid rgba(139,92,246,0.35); color:#E2E8F0; border-radius:12px; padding:10px 12px; font-size:13px; resize:none; height:44px; font-family:inherit;"
    ></textarea>
    <button
      type="button"
      onclick={onSend}
      disabled={busy || !input.trim()}
      style="padding:0 20px;border-radius:12px;border:none;background:linear-gradient(135deg,#7C3AED,#22D3EE);color:#fff;font-weight:700;font-size:13px;cursor:pointer;opacity:{busy || !input.trim() ? 0.5 : 1};"
    >{mode === "research" ? "🔍 Research" : mode === "swarm" ? "🧠 Swarm" : "Send ➤"}</button>
  </div>
  {/if}
</div>
