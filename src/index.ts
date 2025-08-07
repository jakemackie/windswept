import "dotenv/config";
import { Robo } from 'robo.js';
import { windswept } from '@/client/windswept';

const client = new windswept();

client.on('messageCreate', (message) => {
	console.log(message.content)
});

Robo.start({ client });
