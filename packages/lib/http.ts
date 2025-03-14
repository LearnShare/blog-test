import axios from 'axios';

// get token from localStorage
const TOKEN_KEY = 'BLOG_TOKEN';

const token = typeof window !== 'undefined'
    ? window.localStorage.getItem(TOKEN_KEY)
    : '';

const HTTP = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 10 * 1000, // 10s
});

// TODO redirect to login when 401
HTTP.interceptors.response
    .use(
      (res) => res,
      (error) => {
        const {
          status,
          message,
          response,
        } = error;

        const resData = response && response.data
            ? response.data
            : {
              status,
              message,
            };

        return Promise.reject(resData);
      },
    );

export default HTTP;
