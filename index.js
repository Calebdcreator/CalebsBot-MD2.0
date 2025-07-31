// CALEBSBOT-MD2.0 | Main Index File
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'
import path from 'path'
import { Boom } from '@hapi/boom'

// Logger setup
const logger = pino({ level: 'silent' })

// MAIN FUNCTION
async function startCalebBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS('CALEBSBOT-MD2.0'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    getMessage: async () => ({
      conversation: "Message not found.",
    }),
  })

  // 🧠 Pairing code link
  if (!sock.authState.creds.registered) {
    console.log('\n🧠 CalebBot Pairing Link:')
    const code = await sock.requestPairingCode("2347079799769@s.whatsapp.net") // your number here
    console.log(`🔗 Pair this bot using: ${code}\n`)
  }

  // 🔁 Connection status
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode
      if (reason === DisconnectReason.loggedOut) {
        console.log('❌ Logged Out. Delete /auth folder to reset.')
        process.exit()
      } else {
        console.log('🔁 Reconnecting...')
        startCalebBot()
      }
    } else if (connection === 'open') {
      console.log('✅ CALEBSBOT-MD2.0 is now online!')
    }
  })

  // 💾 Save credentials when updated
  sock.ev.on('creds.update', saveCreds)

  // 💬 Message Handler
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ''

    // 🧠 Sample command
    if (body.startsWith('.menu')) {
      await sock.sendMessage(from, {
        text: `🔥 Welcome to *CALEBSBOT-MD2.0* 🔥\n\nType a command:\n- .play song name\n- .truth\n- .groupinfo\n- .anime quote\n...and 396 more!`
      })
    }

    // 🧩 Add more commands here
  })
}

// ▶️ Start the bot
startCalebBot()
