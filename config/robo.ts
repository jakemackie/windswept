import type { Config } from 'robo.js'
import { GatewayIntentBits } from 'discord.js'

export default <Config>{
  clientOptions: {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  },
  type: 'robo',
  plugins: [],
  commands: ["src/commands"],
}