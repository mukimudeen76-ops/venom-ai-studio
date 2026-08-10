#!/data/data/com.termux/files/usr/bin/bash
# ─────────────────────────────────────────────────────────────
# Odysseus on Android (Termux) — one-shot setup + launch
# Nexo AI ka '🛸 Odysseus' tab isi server se connect hota hai.
# ─────────────────────────────────────────────────────────────
set -e
echo "🛸 Odysseus for Android — setup shuru..."

# 1. Packages
pkg update -y
pkg install -y python git openssl

# 2. Clone (agar pehle se hai to skip)
if [ ! -d "$HOME/odysseus" ]; then
  git clone https://github.com/odysseus-dev/odysseus.git "$HOME/odysseus"
fi
cd "$HOME/odysseus"

# 3. Python deps (fastembed optional hai — lite install ke liye skip kiya ja sakta)
pip install -r requirements.txt 2>/dev/null || pip install -r requirements.txt --break-system-packages

# 4. Config: bind 0.0.0.0 taaki phone ke andar WebView access kar sake
export APP_BIND="0.0.0.0"
export APP_PORT="7000"

echo "✅ Server ready. Nexo AI app me '🛸 Odysseus' tab kholo ya browser me: http://localhost:7000"
echo "   (pehla admin password logs me print hoga — CapturedToken/yeh dekho)"
exec python -m uvicorn app:app --host 0.0.0.0 --port 7000
