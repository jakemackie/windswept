import { 
    Client,
    Collection,
    GatewayIntentBits
} from 'discord.js';
import type { Command } from '../types/Command.js';
import { loadEvents } from '../hooks/event.js';
import { loadCommands } from '../hooks/command.js';

export class windswept extends Client {
	public commands: Collection<string, Command>;
	public color: number;
	public environment: string;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			],
			allowedMentions: { repliedUser: false }
		});

		this.commands = new Collection();
		this.color = 0x0091e2;
		this.environment = 'Unknown';
	}

	async init() {
		await loadEvents(this);
		await loadCommands(this);

		const token = process.env.DISCORD_TOKEN;
		if (!token) throw new Error('Missing DISCORD_TOKEN env var');

		await this.login(token);
		this.setColorByApplicationId();
	}

	private setColorByApplicationId() {
		if (!this.application?.id) return;

		switch (this.application.id) {
			case '1390588995183837184': // Production
				this.color = 0x0091e2; // Blue
				this.environment = 'Production';
				break;
			case '1390591656721514608': // Beta
				this.color = 0x2de200; // Green
				this.environment = 'Beta';
				break;
			case '1391917889992527892': // Dev
				this.color = 0xe20073; // Magenta
				this.environment = 'Development';
				break;
			default:
				this.color = 0x0091e2;
				this.environment = 'Unknown';
				break;
		}
	}

	// Static method to get environment color by application ID
	static getEnvironmentColor(applicationId: string): { color: number; environment: string } {
		switch (applicationId) {
			case '1390588995183837184': // Production
				return { color: 0x0091e2, environment: 'Production' };
			case '1390591656721514608': // Beta
				return { color: 0x2de200, environment: 'Beta' };
			case '1391917889992527892': // Dev
				return { color: 0xe20073, environment: 'Development' };
			default:
				return { color: 0x0091e2, environment: 'Unknown' };
		}
	}
}
