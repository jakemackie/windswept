import type {
    SlashCommandBuilder,
    ChatInputCommandInteraction
} from 'discord.js';

export interface Command {
	data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
	category: string;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
