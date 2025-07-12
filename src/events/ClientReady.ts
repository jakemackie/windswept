import {
  Events,
  ActivityType
} from 'discord.js';

import type { windswept } from '../client/windswept.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: windswept) {
    if(!client.user) return;
    console.log(`${client.user.displayName} ready`);

    client.user.setActivity(`${client.environment}`, { type: ActivityType.Listening });
  },
};
