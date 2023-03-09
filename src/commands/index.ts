import { Client } from 'discord.js';

import { gpt3 } from './bing';

export const bootstrap = (client: Client): void => {
  gpt3(client);
};
