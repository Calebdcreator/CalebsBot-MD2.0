const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const pino = require('pino')
const path = require('path')

// store chats/messages
const store = makeInMemoryStore({
    logger: pino().child({ level: 'silent', stream: 'store' })
})
store.readFromFile('./session_store.json')
setInterval(() => {
    store.writeToFile('./session_store.json')
}, 10_000)

// Connect to WhatsApp
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('sessions')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['CALEBsBOT-MD2.0', 'Chrome', '5.0']
    })

    store.bind(sock.ev)

    // Handle connection events
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr, pairingCode } = update

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error = Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) startBot()
        }

        if (update.pairingCode) {
            console.log('\n📲 Pairing Code:\n', update.pairingCode)
        }

        if (connection === 'open') {
            console.log('✅ Connected to WhatsApp as', sock.user.name || sock.user.id)
        }
    })

    sock.ev.on('creds.update', saveCreds)

    return sock
}

module.exports = startBot
