<script>
  import { voiceEngine, VOICE_PRESETS } from "../../lib/voice-engine.js";
  import { findChatEditor, setChatInputText } from "../auto.js";
  import appState from "../state.js";
  import { t } from "../../lib/i18n.svelte.js";

  let isOpen = $state(false);
  let isListening = $state(false);
  let isSpeaking = $state(false);
  let transcriptText = $state("");
  let selectedVoice = $state("venom-female-nova");
  let autoSend = $state(true);

  // Hook voiceEngine event listeners
  voiceEngine.onSpeechStart = () => { isSpeaking = true; };
  voiceEngine.onSpeechEnd = () => { isSpeaking = false; };

  function toggleVoiceModal() {
    isOpen = !isOpen;
    if (!isOpen && isListening) {
      stopListening();
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
    isListening = true;
    transcriptText = "";
    voiceEngine.startListening((text, isFinal) => {
      transcriptText = text;
      if (isFinal && autoSend && text.trim()) {
        const editor = findChatEditor();
        if (editor) {
          setChatInputText(text);
          // Simulate submit or trigger input
          const sendBtn = document.querySelector('button[type="submit"], [aria-label*="Send"], [data-testid*="send"]');
          if (sendBtn) {
            sendBtn.click();
          }
        }
        transcriptText = "";
      }
    });
  }

  function stopListening() {
    isListening = false;
    voiceEngine.stopListening();
  }

  function testVoice() {
    voiceEngine.speak("Hello! Venom AI Studio is online and ready. How can I assist your project today?", selectedVoice);
  }
</script>

<!-- Floating Live Voice Button in Bottom-Right -->
<div class="venom-voice-dock">
  <button
    type="button"
    class="venom-voice-btn"
    class:active={isListening || isSpeaking}
    onclick={toggleVoiceModal}
    title="Venom Live Voice & Interaction Engine"
    aria-label="Venom Live Voice Mode"
  >
    <div class="venom-pulse-ring" class:pulsing={isListening || isSpeaking}></div>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="22"></line>
    </svg>
  </button>
</div>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="venom-voice-backdrop" onclick={toggleVoiceModal}>
    <div class="venom-voice-modal" onclick={(e) => e.stopPropagation()}>
      <div class="venom-voice-header">
        <div class="venom-voice-title">
          <span class="venom-badge-glow">LIVE</span>
          <span>Venom Voice Studio</span>
        </div>
        <button type="button" class="venom-close-btn" onclick={toggleVoiceModal}>×</button>
      </div>

      <!-- Animated Voice Core Visualizer -->
      <div class="venom-visualizer-box" class:listening={isListening} class:speaking={isSpeaking}>
        <div class="venom-sound-wave">
          <div class="bar bar-1"></div>
          <div class="bar bar-2"></div>
          <div class="bar bar-3"></div>
          <div class="bar bar-4"></div>
          <div class="bar bar-5"></div>
          <div class="bar bar-6"></div>
          <div class="bar bar-7"></div>
        </div>
        <div class="venom-status-label">
          {#if isSpeaking}
            <span style="color: #06B6D4;">🔊 Venom AI Speaking...</span>
          {:else if isListening}
            <span style="color: #10B981;">🎙️ Listening to you... (Speak now)</span>
          {:else}
            <span style="color: #A855F7;">⚡ Ready for Voice Interaction</span>
          {/if}
        </div>
      </div>

      {#if transcriptText}
        <div class="venom-transcript-box">
          <span class="transcript-prefix">You:</span> {transcriptText}
        </div>
      {/if}

      <!-- Controls & Mic Trigger -->
      <div class="venom-actions-row">
        <button
          type="button"
          class="venom-mic-action"
          class:recording={isListening}
          onclick={toggleListening}
        >
          {#if isListening}
            🛑 Stop Listening
          {:else}
            🎙️ Start Live Talking
          {/if}
        </button>

        <button type="button" class="venom-test-btn" onclick={testVoice}>
          🔊 Test Voice
        </button>
      </div>

      <!-- Voice Selector -->
      <div class="venom-voice-settings">
        <label class="venom-label" for="venom-voice-select">Choose AI Speaker & Persona:</label>
        <select
          id="venom-voice-select"
          class="venom-select"
          bind:value={selectedVoice}
          onchange={() => voiceEngine.setVoice(selectedVoice)}
        >
          {#each VOICE_PRESETS as preset}
            <option value={preset.id}>{preset.name} - ({preset.description})</option>
          {/each}
        </select>
      </div>

      <!-- Developer & Owner Footer -->
      <div class="venom-owner-card">
        <div class="owner-header">
          <span class="owner-tag">OFFICIAL DEVELOPER</span>
          <span class="owner-name">Tehzeeb</span>
        </div>
        <div class="owner-links">
          <a href="https://instagram.com/xtehzeeb.x" target="_blank" rel="noopener noreferrer">
            📸 Insta: <b>@xtehzeeb.x</b>
          </a>
          <a href="mailto:xtehzeeb.x7@gmail.com">
            ✉️ <b>xtehzeeb.x7@gmail.com</b>
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .venom-voice-dock {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
  }

  .venom-voice-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #9333EA, #06B6D4);
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(147, 51, 234, 0.45);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
  }

  .venom-voice-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 28px rgba(6, 182, 212, 0.6);
  }

  .venom-pulse-ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid #06B6D4;
    opacity: 0;
    pointer-events: none;
  }

  .venom-pulse-ring.pulsing {
    animation: ripple 1.5s ease-out infinite;
  }

  @keyframes ripple {
    0% { transform: scale(0.9); opacity: 0.9; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  .venom-voice-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(8px);
    z-index: 1000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: fadeIn 0.2s ease-out;
  }

  .venom-voice-modal {
    width: 100%;
    max-width: 460px;
    background: #0B0F19;
    border: 1px solid #1E293B;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(147, 51, 234, 0.25);
    padding: 22px;
    color: #F8FAFC;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .venom-voice-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .venom-voice-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 700;
    color: #FFFFFF;
  }

  .venom-badge-glow {
    background: #10B981;
    color: #000;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    box-shadow: 0 0 10px #10B981;
  }

  .venom-close-btn {
    background: none;
    border: none;
    color: #94A3B8;
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
  }

  .venom-visualizer-box {
    background: #111827;
    border: 1px solid #1F2937;
    border-radius: 12px;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .venom-sound-wave {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 36px;
  }

  .bar {
    width: 6px;
    height: 10px;
    background: #9333EA;
    border-radius: 4px;
    transition: height 0.15s ease;
  }

  .listening .bar, .speaking .bar {
    animation: wavePulse 1s ease-in-out infinite alternate;
  }

  .listening .bar { background: #10B981; }
  .speaking .bar { background: #06B6D4; }

  .bar-1 { animation-delay: 0.1s; }
  .bar-2 { animation-delay: 0.3s; }
  .bar-3 { animation-delay: 0.5s; }
  .bar-4 { animation-delay: 0.2s; }
  .bar-5 { animation-delay: 0.4s; }
  .bar-6 { animation-delay: 0.15s; }
  .bar-7 { animation-delay: 0.35s; }

  @keyframes wavePulse {
    0% { height: 8px; }
    100% { height: 34px; }
  }

  .venom-status-label {
    font-size: 13px;
    font-weight: 600;
  }

  .venom-transcript-box {
    margin-top: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #E2E8F0;
  }

  .transcript-prefix {
    color: #10B981;
    font-weight: 700;
    margin-right: 4px;
  }

  .venom-actions-row {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }

  .venom-mic-action {
    flex: 2;
    background: linear-gradient(135deg, #9333EA, #7C3AED);
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .venom-mic-action.recording {
    background: linear-gradient(135deg, #EF4444, #DC2626);
    box-shadow: 0 0 16px rgba(239, 68, 68, 0.5);
  }

  .venom-test-btn {
    flex: 1;
    background: #1E293B;
    color: #E2E8F0;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .venom-voice-settings {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .venom-label {
    font-size: 12px;
    color: #94A3B8;
  }

  .venom-select {
    background: #1E293B;
    color: #FFFFFF;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 12px;
    outline: none;
  }

  .venom-owner-card {
    margin-top: 18px;
    background: rgba(147, 51, 234, 0.1);
    border: 1px solid rgba(147, 51, 234, 0.3);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 11px;
  }

  .owner-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .owner-tag {
    font-size: 9px;
    font-weight: 800;
    color: #A855F7;
    letter-spacing: 0.5px;
  }

  .owner-name {
    font-weight: 700;
    color: #FFFFFF;
  }

  .owner-links {
    display: flex;
    gap: 14px;
    color: #94A3B8;
  }

  .owner-links a {
    color: #38BDF8;
    text-decoration: none;
  }

  .owner-links a:hover {
    text-decoration: underline;
  }
</style>
