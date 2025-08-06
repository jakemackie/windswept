import { config } from 'dotenv';
import { windswept } from '@/client/windswept';

config();

const client = new windswept();
await client.init();
