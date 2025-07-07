import type {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Message
} from 'discord.js';

export interface Command {
	data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
	category?: string;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
	prefix?: (message: Message, args: string[]) => Promise<void>;
}
