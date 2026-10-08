/*******************************
 * src/yoga/voice.js
 * Intelligent voice: speaks only when state changes
 *******************************/

let lastMessage = "";
let isSpeaking = false;

export function speak(text) {
  if (!("speechSynthesis" in window)) return;

  // If SAME message & still speaking → do nothing
  if (text === lastMessage && isSpeaking) return;

  // Update lastMessage only when new message comes
  lastMessage = text;

  // Stop only if previous speech fully finished
  if (!isSpeaking) {
    window.speechSynthesis.cancel();
  }

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.pitch = 1;
  msg.rate = 1.1;
  msg.volume = 1;

  msg.onstart = () => {
    isSpeaking = true;
  };

  msg.onend = () => {
    isSpeaking = false;
  };

  const voices = window.speechSynthesis.getVoices();
  const enVoice =
    voices.find(v => v.name.includes("Google US English")) ||
    voices.find(v => v.lang === "en-US");

  if (enVoice) msg.voice = enVoice;

  window.speechSynthesis.speak(msg);
}
