/**
 * Venom AI Studio - Natural Voice Engine & Speech Synthesizer
 * 
 * Features:
 * - Real-time Voice Input (Speech-to-Text)
 * - Premium Multi-Voice Audio Synthesis (Male & Female presets)
 * - Automatic sentence chunking for natural prosody and low latency
 */

export const VOICE_PRESETS = [
  {
    id: "venom-male-cyber",
    name: "Venom Cyber (Male)",
    gender: "male",
    lang: "en-US",
    pitch: 0.85,
    rate: 1.05,
    description: "Deep, futuristic, resonant male voice"
  },
  {
    id: "venom-male-quantum",
    name: "Venom Quantum (Male)",
    gender: "male",
    lang: "en-US",
    pitch: 1.0,
    rate: 1.1,
    description: "Crisp, dynamic, modern tech male voice"
  },
  {
    id: "venom-female-nova",
    name: "Venom Nova (Female)",
    gender: "female",
    lang: "en-US",
    pitch: 1.15,
    rate: 1.05,
    description: "Natural, warm, expressive female voice"
  },
  {
    id: "venom-female-eclipse",
    name: "Venom Eclipse (Female)",
    gender: "female",
    lang: "en-US",
    pitch: 1.05,
    rate: 1.0,
    description: "Smooth, calm, melodic female voice"
  },
  {
    id: "venom-female-athena",
    name: "Venom Athena (Female)",
    gender: "female",
    lang: "en-US",
    pitch: 1.25,
    rate: 1.1,
    description: "High-clarity, authoritative smart female voice"
  }
];

class VoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.selectedVoiceId = "venom-female-nova";
    this.isListening = false;
    this.isSpeaking = false;
    this.recognition = null;
    this.availableVoices = [];
    this.onTranscript = null;
    this.onSpeechStart = null;
    this.onSpeechEnd = null;

    this.initVoices();
    this.initRecognition();
  }

  initVoices() {
    if (!this.synth) return;

    const updateVoices = () => {
      this.availableVoices = this.synth.getVoices();
    };

    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (this.onTranscript) {
          this.onTranscript(transcript, event.results[event.results.length - 1].isFinal);
        }
      };

      this.recognition.onerror = (err) => {
        console.warn("[Venom Voice] Recognition warning:", err.error);
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try { this.recognition.start(); } catch (e) {}
        }
      };
    }
  }

  setVoice(voiceId) {
    this.selectedVoiceId = voiceId;
  }

  startListening(callback) {
    if (!this.recognition) return false;
    this.onTranscript = callback;
    this.isListening = true;
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      return false;
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
  }

  speak(text, presetId = null) {
    if (!this.synth || !text) return;

    this.stopSpeaking();

    const cleanText = text.replace(/<[^>]*>/g, '').replace(/```[\s\S]*?```/g, '').trim();
    if (!cleanText) return;

    const preset = VOICE_PRESETS.find(p => p.id === (presetId || this.selectedVoiceId)) || VOICE_PRESETS[2];
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick best system voice matching gender
    if (this.availableVoices.length > 0) {
      const match = this.availableVoices.find(v => 
        preset.gender === 'female' 
          ? (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('karen'))
          : (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('george'))
      ) || this.availableVoices[0];

      if (match) utterance.voice = match;
    }

    utterance.pitch = preset.pitch;
    utterance.rate = preset.rate;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onSpeechStart) this.onSpeechStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeechEnd) this.onSpeechEnd();
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

export const voiceEngine = new VoiceEngine();
