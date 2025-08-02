import {
  Events,
  EmbedBuilder,
  type Message, 
} from 'discord.js';

import type { windswept } from '../client/windswept.js';
import prisma from '../lib/prisma.js';

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    // Ignore bots and DMs
    if (message.author.bot || !message) return;

    // Check if the user is marked as AFK
    const afk = await prisma.afk.findUnique({ where: { userId: message.author.id } });

    if (afk) {
      const client = message.client as windswept;

      // Calculate how long the user was AFK
      const afkSince = new Date(afk.updatedAt);
      const currentTime = new Date();
      const timeDiff = currentTime.getTime() - afkSince.getTime();

      const seconds = Math.floor(timeDiff / 1000) % 60;
      const minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
      const hours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) % 7;
      const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));

      const parts: string[] = [];
      if (weeks > 0) parts.push(`${weeks} week${weeks === 1 ? '' : 's'}`);
      if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
      if (hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
      if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
      parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`); // Always include seconds

      let duration: string;
      if (parts.length === 1) {
        duration = parts[0];
      } else if (parts.length === 2) {
        duration = parts.join(' and ');
      } else {
        duration = parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
      }

      // Send a welcome back embed
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `:wave: ${message.author}: Welcome back, you were away for **${duration}**`
            ),
        ],
      });

      // Remove AFK status
      await prisma.afk.delete({ where: { userId: message.author.id } });
    }

    if (message.mentions.users.size > 0) {
      for (const [, user] of message.mentions.users) {
        if (user.bot) continue;

        const mentionedAfk = await prisma.afk.findUnique({ where: { userId: user.id } });

        if (mentionedAfk) {
          const afkSince = new Date(mentionedAfk.updatedAt);
          const afkSinceTimestamp = `<t:${Math.floor(afkSince.getTime() / 1000)}:R>`;

          await message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor((message.client as windswept).color)
                .setDescription(
                  `:zzz: ${user} is AFK${mentionedAfk.reason ? `: **${mentionedAfk.reason}**` : ''} - ${afkSinceTimestamp}`
                ),
            ],
            allowedMentions: { repliedUser: false },
          });
        }
      }
    }
  },
};
