import { 
    Client,
    Collection,
    GatewayIntentBits
} from "discord.js";
import type { Command } from './Command.js';
import { loadEvents } from '../hooks/event.js';
import { loadCommands } from '../hooks/command.js';

export class windswept extends Client {
	public commands: Collection<string, Command>;

	constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences]
		});

		this.commands = new Collection();
	}

	async init() {
		await loadEvents(this);
		await loadCommands(this);

		const token = process.env.DISCORD_TOKEN;
		if (!token) throw new Error('Missing DISCORD_TOKEN env var');
		await this.login(token);
	}
}
