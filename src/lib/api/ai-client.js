/**
 * Nexo AI - Multi-Provider BYOK (Bring Your Own Key) Engine
 * 
 * Direct client-to-provider streaming AI client supporting:
 * - DeepSeek API (deepseek-chat, deepseek-reasoner)
 * - OpenAI API (gpt-4o, gpt-4o-mini, o1, o3-mini)
 * - Anthropic API (claude-3-5-sonnet, claude-3-5-haiku)
 * - Google Gemini API (gemini-1.5-pro, gemini-2.0-flash)
 * - OpenRouter API (universal fallback & multi-model router)
 * 
 * Masterminded & Developed by Tehzeeb (Instagram: @xtehzeeb.x | Support: xtehzeeb.x7@gmail.com)
 */

export const PROVIDERS = {
  deepseek: {
    id: "deepseek",
    name: "DeepSeek Official API",
    endpoint: "https://api.deepseek.com/chat/completions",
    getKeyUrl: "https://platform.deepseek.com/api_keys",
    defaultModel: "deepseek-chat",
    models: [
      { id: "deepseek-chat", name: "DeepSeek V3 (Chat & Code)", context: 64000 },
      { id: "deepseek-reasoner", name: "DeepSeek R1 (Deep Reasoning)", context: 64000 }
    ]
  },
  openai: {
    id: "openai",
    name: "OpenAI API",
    endpoint: "https://api.openai.com/v1/chat/completions",
    getKeyUrl: "https://platform.openai.com/api-keys",
    defaultModel: "gpt-4o",
    models: [
      { id: "gpt-4o", name: "GPT-4o (Omni Flagship)", context: 128000 },
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Fast & Smart)", context: 128000 },
      { id: "o1", name: "OpenAI o1 (Complex Reasoning)", context: 200000 },
      { id: "o3-mini", name: "OpenAI o3-mini (Next-Gen Coding)", context: 200000 }
    ]
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude API",
    endpoint: "https://api.anthropic.com/v1/messages",
    getKeyUrl: "https://console.anthropic.com/settings/keys",
    defaultModel: "claude-3-5-sonnet-20241022",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Best Coding)", context: 200000 },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (Lightning Fast)", context: 200000 }
    ]
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini API",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    getKeyUrl: "https://aistudio.google.com/app/apikey",
    defaultModel: "gemini-2.0-flash-exp",
    models: [
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Multimodal)", context: 1000000 },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Massive Context)", context: 2000000 }
    ]
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter Universal API",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    getKeyUrl: "https://openrouter.ai/keys",
    defaultModel: "deepseek/deepseek-r1",
    models: [
      { id: "deepseek/deepseek-r1", name: "DeepSeek R1 via OpenRouter", context: 64000 },
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet via OpenRouter", context: 200000 },
      { id: "openai/gpt-4o", name: "GPT-4o via OpenRouter", context: 128000 },
      { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B Instruct", context: 128000 }
    ]
  },
  groq: {
    id: "groq",
    name: "Groq (Fast LPU Inference)",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    getKeyUrl: "https://console.groq.com/keys",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", context: 128000 },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant (Ultra Fast)", context: 128000 },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B (32K)", context: 32768 }
    ]
  },
  apilayer: {
    id: "apilayer",
    name: "APILayer (Unified Gateway)",
    endpoint: "https://api.apilayer.com/chat/completions",
    getKeyUrl: "https://apilayer.com/marketplace",
    defaultModel: "gpt-4o-mini",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini via APILayer", context: 128000 },
      { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet via APILayer", context: 200000 },
      { id: "deepseek-chat", name: "DeepSeek V3 via APILayer", context: 64000 }
    ]
  },
  custom: {
    id: "custom",
    name: "Custom Endpoint (OpenAI-compatible)",
    endpoint: "",
    getKeyUrl: "",
    defaultModel: "",
    models: []
  }
};

/**
 * Executes a streaming chat completion request directly to the provider API
 * 
 * @param {object} params
 * @param {string} params.provider - "deepseek" | "openai" | "anthropic" | "gemini" | "openrouter"
 * @param {string} params.model - Model identifier
 * @param {string} params.apiKey - User's local API key
 * @param {Array<{role: string, content: string}>} params.messages - Chat messages
 * @param {string} [params.systemPrompt] - System prompt instructions
 * @param {function(string, object): void} params.onChunk - Live token streaming callback
 * @param {AbortSignal} [params.signal] - Abort controller signal
 * @returns {Promise<{content: string, reasoningContent?: string, usage?: object}>}
 */
export async function streamChatCompletion({
  provider = "deepseek",
  model = "",
  apiKey = "",
  messages = [],
  systemPrompt = "",
  onChunk = () => {},
  signal = null,
  customEndpoint = "", // Custom provider: user-defined OpenAI-compatible base URL
}) {
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
    throw new Error(`API Key is required for provider "${provider}". Please configure your key in Settings.`);
  }

  const selectedProvider = PROVIDERS[provider] || PROVIDERS.deepseek;
  const targetModel = model || selectedProvider.defaultModel;
  const cleanKey = apiKey.trim();

  // Custom provider: override endpoint with user-supplied URL
  if (provider === "custom") {
    if (!customEndpoint || customEndpoint.trim() === "") {
      throw new Error("Custom provider ke liye endpoint URL daalo (Settings > AI Providers > Custom Endpoint).");
    }
    const base = customEndpoint.trim().replace(/\/+$/, "");
    selectedProvider.endpoint = base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
    selectedProvider.defaultModel = targetModel || "gpt-4o-mini";
  }

  // ── Anthropic Messages API Format ──
  if (provider === "anthropic") {
    return handleAnthropicStream({
      endpoint: selectedProvider.endpoint,
      model: targetModel,
      apiKey: cleanKey,
      messages,
      systemPrompt,
      onChunk,
      signal,
    });
  }

  // ── OpenAI-Compatible API Format (DeepSeek, OpenAI, Gemini, OpenRouter) ──
  const requestMessages = [];
  if (systemPrompt && systemPrompt.trim()) {
    requestMessages.push({ role: "system", content: systemPrompt.trim() });
  }

  for (const msg of messages) {
    requestMessages.push({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: String(msg.content || "")
    });
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${cleanKey}`,
  };

  if (provider === "openrouter") {
    headers["HTTP-Referer"] = "https://github.com/mukimudeen76-ops/venom-ai-studio";
    headers["X-Title"] = "Nexo AI Studio";
  }

  const response = await fetch(selectedProvider.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: targetModel,
      messages: requestMessages,
      stream: true,
      temperature: 0.6,
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let parsedMsg = errorText;
    try {
      const errJson = JSON.parse(errorText);
      parsedMsg = errJson.error?.message || errJson.message || errorText;
    } catch (e) {}
    throw new Error(`${selectedProvider.name} Error (${response.status}): ${parsedMsg}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullContent = "";
  let fullReasoning = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;
      if (!trimmed.startsWith("data:")) continue;

      try {
        const json = JSON.parse(trimmed.slice(5).trim());
        const delta = json.choices?.[0]?.delta;
        if (!delta) continue;

        if (delta.reasoning_content) {
          fullReasoning += delta.reasoning_content;
          onChunk(delta.reasoning_content, { type: "reasoning", fullReasoning, fullContent });
        }
        if (delta.content) {
          fullContent += delta.content;
          onChunk(delta.content, { type: "content", fullContent, fullReasoning });
        }
      } catch (e) {
        // Skip malformed chunk
      }
    }
  }

  return {
    content: fullContent,
    reasoningContent: fullReasoning,
  };
}

async function handleAnthropicStream({
  endpoint,
  model,
  apiKey,
  messages,
  systemPrompt,
  onChunk,
  signal,
}) {
  const anthropicMessages = messages
    .filter(m => m.role === "user" || m.role === "assistant")
    .map(m => ({ role: m.role, content: String(m.content || "") }));

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      messages: anthropicMessages,
      system: systemPrompt || undefined,
      max_tokens: 8192,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let parsedMsg = errorText;
    try {
      const errJson = JSON.parse(errorText);
      parsedMsg = errJson.error?.message || errJson.message || errorText;
    } catch (e) {}
    throw new Error(`Anthropic API Error (${response.status}): ${parsedMsg}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullContent = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;

      try {
        const json = JSON.parse(trimmed.slice(5).trim());
        if (json.type === "content_block_delta" && json.delta?.text) {
          fullContent += json.delta.text;
          onChunk(json.delta.text, { type: "content", fullContent });
        }
      } catch (e) {}
    }
  }

  return { content: fullContent };
}
