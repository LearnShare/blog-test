// window.localStorage

const store = typeof window !== 'undefined'
    ? window.localStorage
    : '';
const TOKEN_KEY = 'BLOG_TOKEN';

function set(key: string, value: string) {
  return store.setItem(key, value);
}

function get(key: string) {
  return store.getItem(key);
}

function del(key: string) {
  return store.removeItem(key);
}

function clear() {
  return store.clear();
}

function setToken(token: string) {
  return store.setItem(TOKEN_KEY, token);
}

function getToken() {
  return store.getItem(TOKEN_KEY);
}

const Store = {
  set,
  get,
  del,
  clear,
  setToken,
  getToken,
};

export default Store;
