import {
  Events,
  ActivityType
} from 'discord.js';

import type { windswept } from '@/client/windswept';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: windswept) {
    if(!client.user) return;
    console.log(`${client.user.displayName} ready`);

    const statuses = [
      { 
        type: ActivityType.Watching, 
        text: '.gg/windswept' 
      },
      { 
        type: ActivityType.Playing, 
        text: 'with the wind' 
      },
      { 
        type: ActivityType.Listening, 
        text: 'the breeze' 
      }
    ];

    let i = 0;
    setInterval(() => {
      if (!client.user) return;

      client.user.setActivity(statuses[i % statuses.length].text, {
        type: statuses[i % statuses.length].type,
      });
      i++;
    }, 10000); // 10s
  },
};
