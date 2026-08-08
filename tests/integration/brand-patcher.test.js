// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { initBrandPatcher } from "../../src/content/dom/brand-patcher.js";

describe("Brand Patcher DOM Sanitizer", () => {
  beforeEach(() => {
    document.title = "DeepSeek - Log In";
    document.body.innerHTML = `
      <div class="login-container">
        <h1 id="login-title">Log in to DeepSeek</h1>
        <p id="otp-desc">Enter the DeepSeek verification code sent to your email.</p>
        <input id="email-input" type="email" placeholder="Enter your DeepSeek email" />
        <input id="code-input" type="text" placeholder="DeepSeek code" aria-label="DeepSeek verification code" />
        <button id="submit-btn" title="Sign in to DeepSeek">Continue with DeepSeek</button>
      </div>
    `;
  });

  it("patches existing login page headers, text, and placeholders to Nexo AI", () => {
    initBrandPatcher();

    expect(document.title).toBe("Nexo AI - Log In");
    expect(document.querySelector("#login-title").textContent).toBe("Log in to Nexo AI");
    expect(document.querySelector("#otp-desc").textContent).toBe("Enter the Nexo AI verification code sent to your email.");
    expect(document.querySelector("#email-input").getAttribute("placeholder")).toBe("Enter your Nexo AI email");
    expect(document.querySelector("#code-input").getAttribute("placeholder")).toBe("Nexo AI code");
    expect(document.querySelector("#code-input").getAttribute("aria-label")).toBe("Nexo AI verification code");
    expect(document.querySelector("#submit-btn").getAttribute("title")).toBe("Sign in to Nexo AI");
    expect(document.querySelector("#submit-btn").textContent).toBe("Continue with Nexo AI");
  });

  it("sanitizes dynamically added OTP and verification dialog elements via MutationObserver", async () => {
    initBrandPatcher();

    const otpModal = document.createElement("div");
    otpModal.className = "otp-dialog";
    otpModal.innerHTML = `
      <h2>Verify your DeepSeek Account</h2>
      <p>A 6-digit code has been dispatched by DeepSeek AI.</p>
      <input type="text" placeholder="DeepSeek OTP" />
    `;
    document.body.appendChild(otpModal);

    // Allow MutationObserver microtask to fire
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(otpModal.querySelector("h2").textContent).toBe("Verify your Nexo AI Account");
    expect(otpModal.querySelector("p").textContent).toBe("A 6-digit code has been dispatched by Nexo AI.");
    expect(otpModal.querySelector("input").getAttribute("placeholder")).toBe("Nexo AI OTP");
  });
});
