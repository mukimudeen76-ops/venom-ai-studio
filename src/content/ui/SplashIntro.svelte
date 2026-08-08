<script>
  import { onMount } from "svelte";

  let visible = $state(true);
  let exiting = $state(false);

  onMount(() => {
    // Show splash for 2.2 seconds on app startup, then smoothly transition into studio
    const timer = setTimeout(() => {
      dismiss();
    }, 2200);

    return () => clearTimeout(timer);
  });

  function dismiss() {
    exiting = true;
    setTimeout(() => {
      visible = false;
    }, 500);
  }
</script>

{#if visible}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="venom-splash-screen" class:exiting onclick={dismiss}>
    <div class="splash-particles"></div>
    
    <div class="splash-card">
      <!-- Animated Venom Cyber Logo -->
      <div class="splash-logo-container">
        <div class="splash-plasma-ring"></div>
        <div class="splash-logo-core">
          <svg width="84" height="84" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="splashVGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#C084FC" />
                <stop offset="50%" stop-color="#9333EA" />
                <stop offset="100%" stop-color="#06B6D4" />
              </linearGradient>
            </defs>
            <path d="M 120 140 C 150 180, 200 240, 256 380 C 230 310, 185 245, 145 210 Z" fill="url(#splashVGrad)" />
            <path d="M 392 140 C 362 180, 312 240, 256 380 C 282 310, 327 245, 367 210 Z" fill="#06B6D4" />
            <polygon points="256,180 300,260 256,335 212,260" fill="#34D399" />
            <circle cx="256" cy="260" r="10" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      <div class="splash-title">NEXUS OMNI STUDIO</div>
      <div class="splash-tagline">Autonomous Multi-AI Super Engineering & Security Studio</div>

      <!-- Developer & Mastermind Badge -->
      <div class="splash-creator-badge">
        <span class="badge-role">👑 CREATED & MASTERMINDED BY</span>
        <span class="badge-author">Tehzeeb</span>
        <span class="badge-insta">Instagram: @xtehzeeb.x</span>
      </div>

      <div class="splash-loader-bar">
        <div class="loader-track"></div>
      </div>
    </div>
  </div>
{/if}

<style>
  .venom-splash-screen {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 50% 40%, #170E2B 0%, #080B12 80%, #030509 100%);
    z-index: 10000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #F8FAFC;
    cursor: pointer;
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s ease;
  }

  .venom-splash-screen.exiting {
    opacity: 0;
    transform: scale(1.04);
    pointer-events: none;
  }

  .splash-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    max-width: 480px;
    animation: zoomUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .splash-logo-container {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  .splash-plasma-ring {
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(6, 182, 212, 0.2) 60%, transparent 100%);
    filter: blur(14px);
    animation: splashPulse 1.8s ease-in-out infinite alternate;
  }

  .splash-logo-core {
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 0 24px rgba(147, 51, 234, 0.8));
    animation: logoFloat 2.5s ease-in-out infinite alternate;
  }

  .splash-title {
    font-size: 26px;
    font-weight: 900;
    letter-spacing: 1.5px;
    background: linear-gradient(135deg, #FFFFFF 20%, #C084FC 60%, #06B6D4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(147, 51, 234, 0.5);
  }

  .splash-tagline {
    font-size: 13px;
    color: #94A3B8;
    font-weight: 500;
    line-height: 1.4;
  }

  .splash-creator-badge {
    margin-top: 8px;
    background: rgba(147, 51, 234, 0.15);
    border: 1px solid rgba(147, 51, 234, 0.4);
    padding: 8px 16px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }

  .badge-role {
    font-size: 9px;
    font-weight: 800;
    color: #C084FC;
    letter-spacing: 0.8px;
  }

  .badge-author {
    font-size: 14px;
    font-weight: 800;
    color: #FFFFFF;
  }

  .badge-insta {
    font-size: 11px;
    color: #38BDF8;
    font-weight: 600;
  }

  .splash-loader-bar {
    margin-top: 14px;
    width: 180px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .loader-track {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #9333EA, #06B6D4, #10B981);
    animation: loadTrack 2s ease-in-out forwards;
    transform-origin: left;
  }

  @keyframes loadTrack {
    0% { transform: scaleX(0); }
    50% { transform: scaleX(0.7); }
    100% { transform: scaleX(1); }
  }

  @keyframes splashPulse {
    0% { transform: scale(0.9); opacity: 0.7; }
    100% { transform: scale(1.25); opacity: 1; }
  }

  @keyframes logoFloat {
    0% { transform: translateY(-4px); }
    100% { transform: translateY(4px); }
  }

  @keyframes zoomUp {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
