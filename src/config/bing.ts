import axios from 'axios';

const client = axios.create();

export const bingChat = async (message: string) => {
  const { data } = await client.post(
    'https://bing.khanh.lol/completion',
    {
      parentMessageId: 'a5b0e072-3fa5-4fa8-9485-7cf8fb6d7a2d',
      prompt: message,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return data.response;
};
