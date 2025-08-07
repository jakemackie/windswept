import { config } from 'dotenv';
import { windswept } from '@/client/windswept';
import { Client } from 'discord.js'
import { Robo } from 'robo.js'

config();


const discordClient = new Client();
Robo.start({ client: discordClient })


const client = new windswept();
await client.init();