import {
  createClient,
} from 'redis';

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

// TODO
// - account permission
// - request limit: [req-limit:id:path]

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
    return null;
  }

  return JSON.parse(value);
}

export default {
  set: redis.set,
  get: redis.get,

  setAccountInfo,
  getAccountInfo,
};
