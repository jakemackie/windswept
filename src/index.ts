import { config } from 'dotenv';
import { windswept } from './client/windswept.js';

config();

const client = new windswept();
await client.init();
