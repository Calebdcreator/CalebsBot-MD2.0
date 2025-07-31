// lib/handler.js

const fs = require('fs')
const path = require('path')

const COMMANDS_DIR = path.join(__dirname, '..', 'commands')
let commands = new Map()

function loadCommands(dir = COMMANDS_DIR) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
            loadCommands(filePath) // Recursively load subfolders
        } else if (file.endsWith('.js')) {
            try {
                const command = require(filePath)
                if (command.name) {
                    commands.set(command.name, command)
                    if (command.aliases && Array.isArray(command.aliases)) {
                        command.aliases.forEach(alias => commands.set(alias, command))
                    }
                }
            } catch (err) {
                console.error(`Failed to load command: ${filePath}`, err)
            }
        }
    })
}

async function handleMessage(sock, m) {
    const body = m.message?.conversation || m.message?.extendedTextMessage?.text || ''
    const prefix = '.' // command prefix
    if (!body.startsWith(prefix)) return

    const args = body.slice(prefix.length).trim().split(/ +/)
    const cmdName = args.shift().toLowerCase()
    const command = commands.get(cmdName)

    if (!command) return

    try {
        await command.execute({ sock, m, args, commandName: cmdName })
    } catch (err) {
        console.error(`❌ Error running command "${cmdName}":`, err)
        await sock.sendMessage(m.key.remoteJid, { text: '⚠️ An error occurred while executing that command.' }, { quoted: m })
    }
}

module.exports = {
    loadCommands,
    handleMessage
}
