// Keep a global reference to active utterances to prevent them from being garbage-collected in Chrome/Chromium
let activeUtterances: any[] = [];

// Cache of available voices
let voicesList: SpeechSynthesisVoice[] = [];

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const loadVoices = () => {
    if (window.speechSynthesis.getVoices) {
      voicesList = window.speechSynthesis.getVoices();
    }
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Robustly speaks Japanese text using Web Speech API.
 * Handles:
 * 1. Garbage collection prevention (retaining reference).
 * 2. Proper cleanup of utterances on end/error.
 * 3. Safari and Chrome audio context limitations.
 * 4. Asynchronous voice loading fallback.
 * 
 * @param text The text to read aloud
 * @param rate The speed rate (default: 0.85)
 */
export const speakJapanese = (text: string, rate: number = 0.85) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported in this environment.");
    return;
  }

  try {
    // 1. Cancel active speaking to avoid queue lockup, especially on Safari
    // We call cancel regardless of the speaking status if needed, but checking is safer
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // 2. Remove HTML tags if present
    const cleanText = text.replace(/<[^>]*>/g, "").trim();
    if (!cleanText) return;

    // 3. Create the utterance
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ja-JP";
    utterance.rate = rate;

    // 4. Find Japanese voice
    let jaVoice = voicesList.find((v) => v.lang.toLowerCase().startsWith("ja"));
    
    // Fallback if voicesList wasn't populated yet
    if (!jaVoice && window.speechSynthesis.getVoices) {
      const freshVoices = window.speechSynthesis.getVoices();
      jaVoice = freshVoices.find((v) => v.lang.toLowerCase().startsWith("ja"));
    }

    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    // 5. Keep reference to prevent GC in Chrome/Chromium
    activeUtterances.push(utterance);
    
    const cleanUp = () => {
      activeUtterances = activeUtterances.filter((u) => u !== utterance);
    };

    utterance.onend = cleanUp;
    utterance.onerror = (e) => {
      console.error("SpeechSynthesisUtterance error:", e);
      cleanUp();
    };

    // 6. Speak
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Error in speakJapanese:", error);
  }
};
