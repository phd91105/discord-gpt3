import { Client, Events } from 'discord.js';

import { bingChat } from '../config';
import { reset } from '../config/bing';

export const gpt3 = (client: Client): void => {
  client.on(Events.MessageCreate, async (message) => {
    const mess = message.content.split(' ');
    if (mess[0].toLowerCase() === '!gpt') {
      const id = message.author.id;
      const msgRef = await message.reply('🤔');
      try {
        const data = await bingChat(message.content.replace('!gpt', ''), id);
        await msgRef.edit(data);
      } catch (e) {
        await msgRef.edit('Fail');
      }
    }

    if (mess[0].toLowerCase() === '!reset') {
      const id = message.author.id;
      try {
        reset(id);
        await message.reply('Chat reset.');
      } catch (e) {
        await message.reply('Fail');
      }
    }
  });
};
