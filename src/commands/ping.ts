import type { ChatInputCommandInteraction } from 'discord.js'
import type { CommandResult } from 'robo.js'

export default (interaction: ChatInputCommandInteraction): CommandResult => {
	interaction.reply('Pong!')
}