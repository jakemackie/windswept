import { SlashCommandBuilder } from 'discord.js';
import type { 
	CommandInteraction,
	Message
} from 'discord.js';

export default {
	name: 'ping',
	data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s latency'),

	async execute(interaction: CommandInteraction) {
		const clientLatency = Math.round(interaction.client.ws.ping);
		const preInteractionReply = Date.now();

		await interaction.reply(`bot latency: \`${clientLatency}ms\``);

		const postInteractionReply = Date.now();
		const apiLatency = postInteractionReply - preInteractionReply;

		await interaction.editReply(`bot latency: \`${clientLatency}ms\` api latency: \`${apiLatency}ms\``);
	},

	async prefix(message: Message, _args: string[]) {
		const clientLatency = Math.round(message.client.ws.ping);
		const preMessageReply = Date.now();

		let initialMessageReply = await message.reply(`bot latency: \`${clientLatency}ms\``);

		const postMessageReply = Date.now();
		const apiLatency = postMessageReply - preMessageReply;

		await initialMessageReply.edit(`bot latency: \`${clientLatency}ms\` api latency: \`${apiLatency}ms\``);
	}
};
