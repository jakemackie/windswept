import {
  Events,
  type Message, 
} from 'discord.js';

export default {
  name: Events.MessageCreate,
  execute(message: Message) {
    console.log(`${message.content}`);
  },
};
