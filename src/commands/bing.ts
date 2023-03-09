import { Client, Events } from 'discord.js';

import { bingChat } from '../config';

export const gpt3 = (client: Client): void => {
  client.on(Events.MessageCreate, async (message) => {
    const mess = message.content.split(' ');
    if (mess[0].toLowerCase() === '!gpt') {
      try {
        const msgRef = await message.reply('🤔');
        const data = await bingChat(message.content.replace('!gpt', ''));
        await msgRef.edit(data);
      } catch (e) {
        await message.reply('Fail');
      }
    }
  });
};
