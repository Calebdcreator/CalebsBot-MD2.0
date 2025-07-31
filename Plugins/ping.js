const { performance } = require('perf_hooks')

module.exports = {
  name: 'ping',
  alias: ['ping', 'speed'],
  category: 'settings',
  desc: 'Check bot response speed.',
  async run({ msg, conn }) {
    const start = performance.now()
    await msg.reply('🏓 Pinging...')
    const end = performance.now()
    const speed = (end - start).toFixed(2)

    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    await msg.reply(
      `*Pong!* 🏓\n` +
      `🔧 Speed: ${speed}ms\n` +
      `⏱ Uptime: ${hours}h ${minutes}m ${seconds}s`
    )
  }
}
