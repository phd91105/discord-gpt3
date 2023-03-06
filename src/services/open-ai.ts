import 'dotenv/config';

import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { load } from 'cheerio';
import qs from 'qs';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const instance = wrapper(axios.create({ jar }));

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1660.14';

export const getAccessToken = async () => {
  console.info('\x1b[35m%s\x1b[0m', 'Initiating OpenAI login...');

  const urlCsrf = 'https://explorer.api.openai.com/api/auth/csrf';
  const urlSession = 'https://explorer.api.openai.com/api/auth/session';

  const headers = {
    Host: 'explorer.api.openai.com',
    Accept: '*/*',
    Connection: 'keep-alive',
    'User-Agent': userAgent,
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    Referer: 'https://explorer.api.openai.com/auth/login',
    'Accept-Encoding': 'gzip, deflate, br',
  };

  try {
    const { data } = await instance.get(urlCsrf, { headers });

    console.info('\x1b[33m%s\x1b[0m', 'Waiting for OpenAI to respond...');
    const result = await begin(data.csrfToken);

    if (!result) {
      console.error('\x1b[31m%s\x1b[0m', 'Login failed.');
      return null;
    }

    const { data: loginResult } = await instance.get(urlSession);

    console.info('\x1b[35m%s\x1b[0m', 'User logged in:', loginResult.user.name);
    return loginResult;
  } catch (error) {
    throw new Error((<Error>error).message);
  }
};

const begin = async (csrfToken: string) => {
  console.info('[OpenAI] Auth: step 0');

  const url =
    'https://explorer.api.openai.com/api/auth/signin/auth0?prompt=login';

  const data = qs.stringify({
    callbackUrl: '/',
    csrfToken,
    json: 'true',
  });

  const headers = {
    Host: 'explorer.api.openai.com',
    'User-Agent': userAgent,
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: '*/*',
    'Sec-Gpc': '1',
    'Accept-Language': 'en-US,en;q=0.8',
    Origin: 'https://explorer.api.openai.com',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    Referer: 'https://explorer.api.openai.com/auth/login',
    'Accept-Encoding': 'gzip, deflate',
  };

  try {
    const response = await instance.post(url, data, { headers });

    if (response.data.url.includes('error')) {
      throw new Error('Rate limited');
    }

    return await step1(response.data.url);
  } catch (error) {
    throw new Error((<Error>error).message);
  }
};

const step1 = async (url: string) => {
  console.info('[OpenAI] Auth: step 1');

  const headers = {
    Host: 'auth0.openai.com',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Connection: 'keep-alive',
    'User-Agent': userAgent,
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: 'https://explorer.api.openai.com/',
  };

  try {
    const response = await instance.get(url, { headers: headers });

    const $ = load(response.data);
    const state = <string>$('input[name="state"]').val();

    return await step2(state);
  } catch (error) {
    throw new Error((<Error>error).message);
  }
};

const step2 = async (state: string) => {
  console.info('[OpenAI] Auth: step 2');

  const url = `https://auth0.openai.com/u/login/identifier?state=${state}`;

  const headers = {
    Host: 'auth0.openai.com',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Connection: 'keep-alive',
    'User-Agent': userAgent,
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: 'https://explorer.api.openai.com/',
  };

  try {
    await instance.get(url, { headers: headers });

    return await step3(state);
  } catch (error) {
    throw new Error((<Error>error).message);
  }
};

const step3 = async (state: string) => {
  console.info('[OpenAI] Auth: step 3');

  const url = `https://auth0.openai.com/u/login/identifier?state=${state}`;

  const headers = {
    Host: 'auth0.openai.com',
    Origin: 'https://auth0.openai.com',
    Connection: 'keep-alive',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'User-Agent': userAgent,
    Referer: `https://auth0.openai.com/u/login/identifier?state=${state}`,
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const data = qs.stringify({
    state: state,
    username: process.env.GPT_USERNAME,
    'js-available': false,
    'webauthn-available': true,
    'is-brave': false,
    'webauthn-platform-available': true,
    action: 'default',
  });

  try {
    await instance.post(url, data, { headers });

    return await step4(state);
  } catch (error) {
    throw new Error((<Error>error).message);
  }
};

const step4 = async (state: string) => {
  console.info('[OpenAI] Auth: step 4');

  const url = `https://auth0.openai.com/u/login/password?state=${state}`;

  const headers = {
    Host: 'auth0.openai.com',
    Origin: 'https://auth0.openai.com',
    Connection: 'keep-alive',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'User-Agent': userAgent,
    Referer: `https://auth0.openai.com/u/login/password?state=${state}`,
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const data = qs.stringify({
    state: state,
    username: process.env.GPT_USERNAME,
    password: process.env.GPT_PASSWORD,
    action: 'default',
  });

  try {
    const response = await instance.post(url, data, {
      headers,
      validateStatus: () => true,
    });

    if (response.status === axios.HttpStatusCode.Ok) {
      return true;
    }
  } catch (error) {
    throw new Error((<Error>error).message);
  }
};
