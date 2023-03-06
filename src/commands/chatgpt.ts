import { Client } from 'discord.js';

export const gpt3 = (client: Client): void => {
  client.on('messageCreate', async (message) => {
    const mess = message.content.split(' ');
    if (mess[0].toLowerCase() === '!gpt') {
      try {
        const data = await global.openai.sendMessage(
          message.content.replace('!gpt', ''),
        );
        message.reply(data.text);
      } catch (e) {
        message.reply('Fail');
      }
    }
  });
};
