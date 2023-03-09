import app from './app';
import { port } from './config';
import { discord } from './config';

const main = async () => {
  try {
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
