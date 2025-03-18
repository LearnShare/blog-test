import axios from 'axios';

// get token from localStorage
const TOKEN_KEY = 'BLOG_TOKEN';

function getToken() {
  const token = typeof window !== 'undefined'
      ? window.localStorage.getItem(TOKEN_KEY)
      : '';

  return token;
}

const HTTP = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10 * 1000, // 10s
});

HTTP.interceptors.request
    .use((req) => {
      const {
        headers,
      } = req;

      return {
        ...req,
        headers: {
          ...headers,
          Authorization: `Bearer ${getToken()}`,
        },
      };
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
