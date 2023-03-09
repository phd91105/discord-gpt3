import axios from 'axios';

const client = axios.create();
let parentMessageId = '';

export const bingChat = async (message: string) => {
  const { data } = await client.post(
    'https://bing.khanh.lol/completion',
    {
      parentMessageId,
      prompt: message,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  parentMessageId = data.messageId;
  return data.response.replace(/\[\^\d\^\]*/g, '');
};
