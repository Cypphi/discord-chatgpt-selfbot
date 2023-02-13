const { Client } = require('discord.js-selfbot-v13')
const config = require('./config.json')

const client = new Client({
    checkUpdate: false,
})

client.on('ready', () => {
    console.log('Ready!')
})

async function askGPT(question, channel, args) {
    const { ChatGPTAPI } = await import('chatgpt')

    channel.send('Thinking...').then(async msg => {
        const api = new ChatGPTAPI({
            apiKey: config.key
        })

        const res = await api.sendMessage(question)

        msg.edit('```\n' + res.text + '\n```').then(() => {
        }).catch(err => {
            message.channel.send('**ChatGPT » ** ' + '`' + args.join(' ') + '` | ' + 'Error: ' + err)
        })
    })
}

client.on('messageCreate', async (message) => {
    let args = message.content.split(" ").slice(1)
    if (message.author !== client.user) return
    if (!message.content.startsWith(config.prefix)) return
    if (message.content.toLocaleLowerCase().split(" ")[0].slice(config.prefix.length) == 'gpt') {
        askGPT(args.join(' '), message.channel, args)
        message.delete()
    }
})

client.login(config.token)