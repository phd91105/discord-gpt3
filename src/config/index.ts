import 'dotenv/config';

export const port = process.env.PORT || 8080;
export { client as discord } from './discord';
// export { openai } from './openai';
