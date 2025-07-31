// config.js

module.exports = {
  owner: ["2348100000000"], // Replace with your WhatsApp number (no "+" sign)
  ownerName: "CALEB 💻",
  botName: "CALEBsBOT-MD2.0 🤖",
  sessionName: "CALEBsBotSession", // Used for pairing
  prefix: ".",
  nsfwEnabled: true,
  autoRead: true,
  autoTyping: false,
  autoRecording: false,
  privateMode: false,
  footer: "CALEBsBOT-MD2.0 • Powered by Calebdcreator 💥",
  
  // Appearance
  emoji: "❄️",
  menuEmoji: "📜",
  aliveEmoji: "💻",
  groupEmoji: "👥",

  // Developer Only
  github: "https://github.com/Calebdcreator/CALEBsBOT-MD2.0",
  support: "https://wa.me/2348100000000",
  theme: "dark", // or 'light' (future use)

  // Command toggles (for your control panel feature later)
  toggles: {
    anime: true,
    nsfw: true,
    mediaTools: true,
    pairingMode: true,
    enableLogs: true
  },

  messages: {
    success: "✅ Done!",
    admin: "❌ This command is for *Admins only!*",
    botAdmin: "❌ I need to be *admin* first!",
    owner: "❌ Only my *owner* can use this!",
    group: "❌ Only usable in *Groups*!",
    private: "❌ Only works in *Private Chat*!",
    bot: "❌ This feature is only for the *bot* itself!",
    wait: "⏳ Processing...",
    link: "❌ Please provide a *valid link!*"
  }
};
