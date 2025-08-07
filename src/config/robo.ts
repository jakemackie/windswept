import { GatewayIntentBits } from 'discord.js'

export default {
	clientOptions: {
		intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions]
	}
}