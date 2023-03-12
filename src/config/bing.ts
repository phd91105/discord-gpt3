import axios from 'axios';

const client = axios.create();
export const messageStorage: { [key: string]: any } = {};

export const bingChat = async (message: string, userId: string) => {
  const { data } = await client.post('https://bing.khanh.lol/completion', {
    parentMessageId: messageStorage[userId]?.parentMessageId,
    prompt: message,
  });

  messageStorage[userId] = { parentMessageId: data.messageId };
  return data.response.replace(/\[\^\d+\^\]*/g, '');
};

export const reset = (userId: string) => {
  messageStorage[userId] = {};
};
