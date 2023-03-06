import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt';
import { CronJob } from 'cron';

import app from './app';
import { port } from './config';
import { discord } from './config';
import { getAccessToken } from './services';

const refreshTokenGpt = new CronJob('0 */5 * * *', async function () {
  const { accessToken } = await getAccessToken();
  global.openai = new ChatGPTUnofficialProxyAPI({
    accessToken,
  });
});

const main = async () => {
  try {
    // const { accessToken } = await getAccessToken();

    global.openai = new ChatGPTAPI({
      apiKey: process.env.CHAT_GPT_KEY?.trim() as string,
    });

    discord.on('ready', () => {
      console.log(`> Bot is on ready`);
    });

    app.listen(port);
    console.info(`Server on http://localhost:${port}`);

    // refreshTokenGpt.start();
  } catch (error) {
    console.error(error);
  }
};

main();
