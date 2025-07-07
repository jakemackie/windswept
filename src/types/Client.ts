import { 
    Client,
    Collection,
    GatewayIntentBits
} from "discord.js";
import type { Command } from './Command.js';

export class windswept extends Client {
	public commands: Collection<string, Command>;

    constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences]
		});

		this.commands = new Collection();
	}
}
