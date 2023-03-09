import 'dotenv/config';

export const port = process.env.PORT || 8080;
export { bingChat } from './bing';
export { client as discord } from './discord';
