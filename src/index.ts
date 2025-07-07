import { config } from 'dotenv';
import { windswept } from './types/Client.js';

config();

const client = new windswept();
await client.init();
