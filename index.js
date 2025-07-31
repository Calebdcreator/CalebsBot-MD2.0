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

// Logger
const logger = pino({ level: 'silent' })

// Auth setup (multi-device + pairing code)
async function startCalebBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const { version, isLatest } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS('CALEBSBOT-MD2.0'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    getMessage: async (key) => ({
      conversation: "Message not found, sorry!",
    }),
  })

  // Pairing link display
  if (!sock.authState.creds.registered) {
    console.log('\n🧠 CalebBot Pairing Link:')
    const code = await sock.requestPairingCode("2349012345678@s.whatsapp.net") // Replace with your number
    console.log(`🔗 Pair this bot using: ${code}\n`)
  }

  // Connection Events
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode
      if (reason === DisconnectReason.loggedOut) {
        console.log('❌ Logged Out. Please delete /auth and re-run.')
        process.exit()
      } else {
        console.log('🔁 Reconnecting...')
        startCalebBot()
      }
    } else if (connection === 'open') {
      console.log('✅ CALEBSBOT-MD2.0 is now online!')
    }
  })

  // Save credentials on updates
  sock.ev.on('creds.update', saveCreds)

  // Message handler
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ''

    // Core command handler
    if (body.startsWith('.menu')) {
      await sock.sendMessage(from, {
        text: `🔥 Welcome to *CALEBSBOT-MD2.0* 🔥\n\nType a command:\n- .play song name\n- .truth\n- .groupinfo\n- .anime quote\n...and 396 more!`
      })
    }

    // Add more command routes here
  })
}

startCalebBot()
