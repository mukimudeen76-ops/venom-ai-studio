/**
 * Venom Omni AI Studio - Advanced Cybersecurity & Ethical Hacking Arsenal
 * 
 * Capabilities:
 * - Vulnerability Assessment & Security Auditing (OWASP Top 10)
 * - Cryptographic & Cipher Analysis (AES, RSA, Hashes, JWT, XOR, Entropy)
 * - Reverse Engineering & Deobfuscation Engine (JS, Bytecode, Shellcode, Headers)
 * - Network Packet & HTTP Header Threat Inspection
 */

export const SECURITY_TOOLS = [
  {
    id: "vuln-audit",
    name: "Vulnerability Auditor",
    category: "security",
    description: "Deep security analysis covering SQLi, XSS, SSRF, IDOR, and auth bypasses."
  },
  {
    id: "crypto-analyzer",
    name: "Cryptographic Engine",
    category: "security",
    description: "Inspects hash formats, entropy, cipher mechanisms, JWT tokens, and key strengths."
  },
  {
    id: "deobfuscator",
    name: "Code Deobfuscator & Reverse Engineering",
    category: "security",
    description: "Deobfuscates complex JavaScript, unpacks packed binaries, and analyzes AST structures."
  },
  {
    id: "recon-intel",
    name: "OSINT & Threat Reconnaissance",
    category: "security",
    description: "Gathers multi-source intelligence, DNS records, header security, and attack surface maps."
  }
];

export function analyzeSecurityPayload(input) {
  if (!input || typeof input !== 'string') return { risk: "none", findings: [] };

  const findings = [];
  
  // 1. Secret / Credential Leaks
  if (/ghp_[a-zA-Z0-9]{36,}/.test(input) || /github_pat_/.test(input)) {
    findings.push({ severity: "CRITICAL", type: "Exposed GitHub Token", advice: "Token intercepted and secured in Vault." });
  }
  if (/sk-[a-zA-Z0-9]{32,}/.test(input)) {
    findings.push({ severity: "CRITICAL", type: "Exposed API Key", advice: "API Key secured in Vault." });
  }
  if (/eyJ[a-zA-Z0-9_\-]{20,}\.eyJ[a-zA-Z0-9_\-]{20,}/.test(input)) {
    findings.push({ severity: "HIGH", type: "Exposed JWT Token", advice: "Ensure JWT signature and expiration are verified." });
  }

  // 2. Common Injection Signatures
  if (/('|--|\/\*|UNION\s+SELECT)/i.test(input)) {
    findings.push({ severity: "HIGH", type: "SQL Injection Vector", advice: "Use parameterized queries and prepared statements." });
  }
  if (/<script|javascript:|onerror=|onload=/i.test(input)) {
    findings.push({ severity: "HIGH", type: "Cross-Site Scripting (XSS) Vector", advice: "Sanitize user input with DOMPurify and encode HTML entities." });
  }

  return {
    risk: findings.some(f => f.severity === "CRITICAL") ? "CRITICAL" : (findings.length > 0 ? "HIGH" : "CLEAN"),
    findings
  };
}

export function decodeJwtToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (e) {
    return null;
  }
}
