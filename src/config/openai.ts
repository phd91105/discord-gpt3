// import { ChatGPTAPI } from 'chatgpt';

// export const openai = new ChatGPTAPI({
//   apiKey: process.env.CHAT_GPT_KEY,
//     completionParams: {
//       model: 'gpt-3.5-turbo',
//     },
// });

/* eslint-disable no-var */
export {};

declare global {
  var openai: any;
}
