import {
  createClient,
} from 'redis';

import DB from '@packages/database';

const redis = createClient({
  host: 'localhost',
  port: 6379,
});

redis.on('error', (error) => {
  console.log('[REDIS]: ', error);
});

redis.on('ready', () => {
  console.log('[REDIS]: ready');
});

await redis.connect();

function setAccountInfo(id: number, data: any): void {
  const key = [
    'account',
    id,
  ].join(':');

  const value = JSON.stringify(data);

  redis.set(key, value);
}

async function getAccountInfo(id): any {
  const key = [
    'account',
    id,
  ].join(':');

  const value = await redis.get(key);
  if (!value) {
    const {
      data: account,
      error,
    } = await DB.account.getAccountById(id);
    if (error) {
      return null;
    }

    const {
      password,
      ...rest
    } = account;

    await setAccountInfo(id, rest);

    return rest;
  }

  return JSON.parse(value);
}

export default {
  set: redis.set,
  get: redis.get,

  setAccountInfo,
  getAccountInfo,
};
