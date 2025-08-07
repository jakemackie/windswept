import { client } from 'robo.js'
import type { Message } from 'discord.js'

export default () => {
	client.on('messageCreate', (message: Message) => {
		console.log(message.content)
	})
}