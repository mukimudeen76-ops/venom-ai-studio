<script>
  import { voiceEngine, VOICE_PRESETS } from "../../lib/voice-engine.js";
  import { findChatEditor, setChatInputText } from "../auto.js";
  import appState from "../state.js";
  import { t } from "../../lib/i18n.svelte.js";

  let isOpen = $state(false);
  let isListening = $state(false);
  let isSpeaking = $state(false);
  let transcriptText = $state("");
  let aiSpeakingText = $state("");
  let selectedVoice = $state("venom-female-nova");
  let continuousMode = $state(true);
  let audioLevel = $state(0.4);

  // Hook voiceEngine event listeners
  voiceEngine.onSpeechStart = () => { 
    isSpeaking = true; 
  };
  voiceEngine.onSpeechEnd = () => { 
    isSpeaking = false; 
    if (continuousMode && isOpen) {
      setTimeout(() => startListening(), 400);
    }
  };

  function toggleLiveVoice() {
    isOpen = !isOpen;
    if (isOpen) {
      startListening();
    } else {
      stopListening();
      voiceEngine.stopSpeaking();
    }
  }

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    if (isSpeaking) {
      voiceEngine.stopSpeaking();
    }
    isListening = true;
    transcriptText = "";
    
    // Animate audio level pulse
    audioLevel = 0.8;

    voiceEngine.startListening((text, isFinal) => {
      transcriptText = text;
      if (isFinal && text.trim()) {
        stopListening();
        sendQueryToAI(text.trim());
      }
    });
  }

  function stopListening() {
    isListening = false;
    audioLevel = 0.3;
    voiceEngine.stopListening();
  }

  function sendQueryToAI(query) {
    const editor = findChatEditor();
    if (editor) {
      setChatInputText(query);
      const sendBtn = document.querySelector('button[type="submit"], [aria-label*="Send"], [data-testid*="send"], .send-button');
      if (sendBtn) {
        sendBtn.click();
      }
      listenForAiResponse();
    } else {
      // Fallback local speak
      voiceEngine.speak(`I received your prompt: "${query}". Processing in Venom AI Studio...`, selectedVoice);
    }
  }

  function listenForAiResponse() {
    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      const assistantMessages = document.querySelectorAll('[class*="assistant"], [data-role="assistant"], .ds-message-assistant, .bds-assistant-message');
      if (assistantMessages.length > 0) {
        const lastMsg = assistantMessages[assistantMessages.length - 1];
        const text = lastMsg ? (lastMsg.innerText || lastMsg.textContent) : "";
        
        // When text is available and stream finishes
        const isGenerating = document.querySelector('button[aria-label*="Stop"], [data-testid*="stop"]');
        if (!isGenerating && text.trim().length > 10) {
          clearInterval(interval);
          aiSpeakingText = text.slice(0, 400);
          voiceEngine.speak(text, selectedVoice);
        }
      }

      if (checkCount > 80) clearInterval(interval);
    }, 500);
  }

  function testVoice() {
    voiceEngine.speak("Hello! Venom AI Studio is online and developed by Tehzeeb. I am ready to talk with you live.", selectedVoice);
  }
</script>

<!-- Floating Live Voice Orb (Bottom Right) -->
<div class="venom-live-dock">
  <button
    type="button"
    class="venom-live-trigger"
    class:active={isOpen || isListening || isSpeaking}
    onclick={toggleLiveVoice}
    title="Venom Live Voice Mode (Talk in Real-Time)"
    aria-label="Venom Live Voice Mode"
  >
    <div class="venom-plasma-glow" class:glowing={isListening || isSpeaking}></div>
    <div class="venom-inner-core">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="22"></line>
      </svg>
    </div>
    <span class="live-pill-tag">LIVE</span>
  </button>
</div>

{#if isOpen}
  <!-- Full-Screen Immersive Gemini Live Style Experience -->
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="venom-fullscreen-modal" onclick={toggleLiveVoice}>
    <div class="venom-live-container" onclick={(e) => e.stopPropagation()}>
      
      <!-- Top Navigation & Branding -->
      <div class="venom-live-topbar">
        <div class="venom-brand-badge">
          <span class="pulse-dot"></span>
          <span class="brand-text">VENOM LIVE STUDIO</span>
        </div>
        <button type="button" class="venom-exit-btn" onclick={toggleLiveVoice} aria-label="Close Voice Mode">✕</button>
      </div>

      <!-- Central Gemini Live Style Pulsing Plasma Orb -->
      <div class="venom-orb-stage">
        <div class="plasma-orb-wrapper" class:speaking={isSpeaking} class:listening={isListening}>
          <div class="plasma-outer-ring"></div>
          <div class="plasma-energy-core"></div>
          <div class="plasma-inner-spark"></div>
        </div>

        <!-- Live Waveform Spectrum -->
        <div class="live-spectrum-bars" class:active={isListening || isSpeaking}>
          <div class="spectrum-bar sb-1"></div>
          <div class="spectrum-bar sb-2"></div>
          <div class="spectrum-bar sb-3"></div>
          <div class="spectrum-bar sb-4"></div>
          <div class="spectrum-bar sb-5"></div>
          <div class="spectrum-bar sb-6"></div>
          <div class="spectrum-bar sb-7"></div>
          <div class="spectrum-bar sb-8"></div>
        </div>

        <!-- State Status Display -->
        <div class="venom-status-banner">
          {#if isSpeaking}
            <div class="status-msg speaking-color">🔊 Venom AI is Speaking...</div>
          {:else if isListening}
            <div class="status-msg listening-color">🎙️ Listening to you... (Speak now)</div>
          {:else}
            <div class="status-msg ready-color">⚡ Tap Mic to Speak</div>
          {/if}
        </div>
      </div>

      <!-- Real-Time Live Transcript Area -->
      <div class="venom-live-transcript-card">
        {#if transcriptText}
          <div class="transcript-line user-line">
            <b style="color: #10B981;">You:</b> {transcriptText}
          </div>
        {:else if aiSpeakingText}
          <div class="transcript-line ai-line">
            <b style="color: #38BDF8;">Venom AI:</b> {aiSpeakingText}
          </div>
        {:else}
          <div class="transcript-placeholder">
            Speak naturally. Your voice is transcribed, analyzed, and answered in real-time.
          </div>
        {/if}
      </div>

      <!-- Live Controls -->
      <div class="venom-controls-toolbar">
        <button
          type="button"
          class="venom-mic-toggle-btn"
          class:recording={isListening}
          onclick={toggleListening}
        >
          {#if isListening}
            <span class="icon">🛑</span>
            <span>Pause Mic</span>
          {:else}
            <span class="icon">🎙️</span>
            <span>Speak Now</span>
          {/if}
        </button>

        <button type="button" class="venom-sample-btn" onclick={testVoice}>
          🔊 Test Voice
        </button>
      </div>

      <!-- Voice Persona Selector -->
      <div class="venom-voice-picker">
        <label class="picker-label" for="live-voice-select">Voice Preset & Speaker Tone:</label>
        <select
          id="live-voice-select"
          class="picker-dropdown"
          bind:value={selectedVoice}
          onchange={() => voiceEngine.setVoice(selectedVoice)}
        >
          {#each VOICE_PRESETS as preset}
            <option value={preset.id}>{preset.name} - ({preset.description})</option>
          {/each}
        </select>
      </div>

      <!-- Developer & Owner Credentials Card -->
      <div class="venom-credits-footer">
        <div class="creator-badge">
          <span>👑 CREATED & DEVELOPED BY</span>
          <b>Tehzeeb</b>
        </div>
        <div class="creator-handles">
          <a href="https://instagram.com/xtehzeeb.x" target="_blank" rel="noopener noreferrer" class="handle-item">
            📸 Instagram: <b>@xtehzeeb.x</b>
          </a>
          <span class="dot-sep">•</span>
          <span class="handle-item">Venom AI Studio v1.0.0</span>
        </div>
      </div>

    </div>
  </div>
{/if}

<style>
  .venom-live-dock {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 999999;
  }

  .venom-live-trigger {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: linear-gradient(135deg, #9333EA, #06B6D4);
    border: 2px solid rgba(255, 255, 255, 0.25);
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(147, 51, 234, 0.55), 0 0 20px rgba(6, 182, 212, 0.4);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease;
    position: relative;
  }

  .venom-live-trigger:hover {
    transform: scale(1.12);
    box-shadow: 0 12px 40px rgba(6, 182, 212, 0.75);
  }

  .venom-plasma-glow {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid #06B6D4;
    opacity: 0;
    pointer-events: none;
  }

  .venom-plasma-glow.glowing {
    animation: livePulse 1.6s ease-out infinite;
  }

  @keyframes livePulse {
    0% { transform: scale(0.9); opacity: 0.95; }
    100% { transform: scale(1.7); opacity: 0; }
  }

  .live-pill-tag {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #10B981;
    color: #000000;
    font-size: 8px;
    font-weight: 900;
    padding: 2px 5px;
    border-radius: 6px;
    letter-spacing: 0.5px;
    box-shadow: 0 0 10px #10B981;
  }

  /* Fullscreen Backdrop */
  .venom-fullscreen-modal {
    position: fixed;
    inset: 0;
    background: rgba(5, 7, 13, 0.88);
    backdrop-filter: blur(20px);
    z-index: 1000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.25s ease-out;
  }

  .venom-live-container {
    width: 100%;
    max-width: 520px;
    background: #0B0E17;
    border: 1px solid #1E293B;
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(147, 51, 234, 0.25);
    color: #F8FAFC;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .venom-live-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .venom-brand-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(147, 51, 234, 0.15);
    border: 1px solid rgba(147, 51, 234, 0.4);
    padding: 4px 10px;
    border-radius: 20px;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10B981;
    box-shadow: 0 0 10px #10B981;
    animation: blink 1.2s infinite alternate;
  }

  @keyframes blink {
    0% { opacity: 0.4; }
    100% { opacity: 1; }
  }

  .brand-text {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #E2E8F0;
  }

  .venom-exit-btn {
    background: #1E293B;
    border: none;
    color: #94A3B8;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .venom-exit-btn:hover {
    background: #334155;
    color: #FFFFFF;
  }

  /* Gemini Live Pulsing Orb Stage */
  .venom-orb-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px 0;
  }

  .plasma-orb-wrapper {
    width: 140px;
    height: 140px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plasma-outer-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(6, 182, 212, 0.1) 70%, transparent 100%);
    filter: blur(10px);
    animation: spinSlow 12s linear infinite;
  }

  .plasma-energy-core {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #9333EA, #38BDF8, #10B981);
    box-shadow: 0 0 40px rgba(147, 51, 234, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.6);
    animation: orbFloat 2.8s ease-in-out infinite alternate;
  }

  .plasma-inner-spark {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #FFFFFF;
    filter: blur(4px);
    opacity: 0.85;
    animation: sparkPulse 1.4s ease-in-out infinite alternate;
  }

  .speaking .plasma-energy-core {
    animation: orbSpeaking 0.6s ease-in-out infinite alternate;
    box-shadow: 0 0 60px rgba(56, 189, 248, 0.9);
  }

  .listening .plasma-energy-core {
    animation: orbListening 0.8s ease-in-out infinite alternate;
    box-shadow: 0 0 60px rgba(16, 185, 129, 0.9);
  }

  @keyframes orbFloat {
    0% { transform: scale(0.92) rotate(0deg); }
    100% { transform: scale(1.08) rotate(180deg); }
  }

  @keyframes orbSpeaking {
    0% { transform: scale(1.0) translateY(-4px); }
    100% { transform: scale(1.22) translateY(4px); }
  }

  @keyframes orbListening {
    0% { transform: scale(0.95); }
    100% { transform: scale(1.15); }
  }

  @keyframes sparkPulse {
    0% { transform: scale(0.7); opacity: 0.5; }
    100% { transform: scale(1.3); opacity: 1; }
  }

  @keyframes spinSlow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Live Spectrum Bars */
  .live-spectrum-bars {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 28px;
  }

  .spectrum-bar {
    width: 4px;
    height: 6px;
    background: #334155;
    border-radius: 3px;
    transition: height 0.2s ease, background 0.2s ease;
  }

  .active .spectrum-bar {
    background: #06B6D4;
    animation: barDance 0.8s ease-in-out infinite alternate;
  }

  .active .sb-1 { animation-delay: 0.1s; }
  .active .sb-2 { animation-delay: 0.3s; }
  .active .sb-3 { animation-delay: 0.5s; }
  .active .sb-4 { animation-delay: 0.2s; }
  .active .sb-5 { animation-delay: 0.4s; }
  .active .sb-6 { animation-delay: 0.15s; }
  .active .sb-7 { animation-delay: 0.35s; }
  .active .sb-8 { animation-delay: 0.25s; }

  @keyframes barDance {
    0% { height: 6px; }
    100% { height: 26px; }
  }

  .venom-status-banner {
    font-size: 14px;
    font-weight: 700;
  }

  .speaking-color { color: #38BDF8; }
  .listening-color { color: #10B981; }
  .ready-color { color: #C084FC; }

  /* Live Transcript Card */
  .venom-live-transcript-card {
    background: #111827;
    border: 1px solid #1E293B;
    border-radius: 14px;
    padding: 16px;
    min-height: 70px;
    font-size: 13px;
    line-height: 1.5;
  }

  .transcript-placeholder {
    color: #64748B;
    font-style: italic;
    text-align: center;
  }

  /* Controls */
  .venom-controls-toolbar {
    display: flex;
    gap: 12px;
  }

  .venom-mic-toggle-btn {
    flex: 2;
    background: linear-gradient(135deg, #9333EA, #7C3AED);
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 20px rgba(147, 51, 234, 0.4);
    transition: transform 0.15s ease;
  }

  .venom-mic-toggle-btn.recording {
    background: linear-gradient(135deg, #EF4444, #DC2626);
    box-shadow: 0 4px 25px rgba(239, 68, 68, 0.6);
  }

  .venom-sample-btn {
    flex: 1;
    background: #1E293B;
    border: 1px solid #334155;
    color: #E2E8F0;
    border-radius: 12px;
    padding: 14px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .venom-sample-btn:hover {
    background: #334155;
  }

  .venom-voice-picker {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .picker-label {
    font-size: 12px;
    color: #94A3B8;
  }

  .picker-dropdown {
    background: #1E293B;
    color: #F8FAFC;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 12px;
    outline: none;
  }

  /* Creator Footer */
  .venom-credits-footer {
    background: rgba(147, 51, 234, 0.1);
    border: 1px solid rgba(147, 51, 234, 0.3);
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 11px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .creator-badge {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .creator-badge span {
    font-size: 9px;
    font-weight: 800;
    color: #A855F7;
    letter-spacing: 0.5px;
  }

  .creator-badge b {
    color: #FFFFFF;
    font-size: 12px;
  }

  .creator-handles {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #94A3B8;
  }

  .handle-item {
    color: #38BDF8;
    text-decoration: none;
  }

  .handle-item:hover {
    text-decoration: underline;
  }

  .dot-sep {
    color: #64748B;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
