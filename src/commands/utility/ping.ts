import { 
	SlashCommandBuilder,
	EmbedBuilder
} from 'discord.js';

import type { 
	CommandInteraction,
	Message
} from 'discord.js';

import { windswept } from '../../client/windswept.js';

export default {
	name: 'ping',
	data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s latency'),

	async execute(interaction: CommandInteraction) {
		const client = interaction.client as windswept;
		const clientLatency = Math.round(interaction.client.ws.ping);

		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle(`${client.user?.username}`)
			.addFields(
				{ 
					name: 'Bot Latency', 
					value: `\`${clientLatency}ms\``, 
					inline: false 
				},
				{ 
					name: 'Environment', 
					value: `\`${client.environment}\``, 
					inline: false 
				}
			);

		await interaction.reply({ embeds: [embed] });
	},

	async prefix(message: Message, _args: string[]) {
		const client = message.client as windswept;
		const clientLatency = Math.round(message.client.ws.ping);

		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle(`${client.user?.username}`)
			.addFields(
				{ 
					name: 'Bot Latency', 
					value: `\`${clientLatency}ms\``, 
					inline: false 
				},
				{ 
					name: 'Environment', 
					value: `\`${client.environment}\``, 
					inline: false 
				}
			);

		await message.reply({ embeds: [embed] });
	}
};
