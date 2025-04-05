import axios from 'axios';

// get token from localStorage
const TOKEN_KEY = 'BLOG_TOKEN';

function getToken() {
  const token = typeof window !== 'undefined'
      ? window.localStorage.getItem(TOKEN_KEY)
      : '';

  return token;
}

let baseURL = '';

// Vite support
try {
  if (import.meta.env.VITE_API_URL) {
    baseURL = import.meta.env.VITE_API_URL;
  }
} catch (error) {
  // console.log(error);
}
// others
try {
  if (process.env.NEXT_PUBLIC_API_URL) {
    baseURL = process.env.NEXT_PUBLIC_API_URL;
  }
} catch (error) {
  // console.log(error);
}

const HTTP = axios.create({
  baseURL,
  timeout: 10 * 1000, // 10s
});

HTTP.interceptors.request
    .use((req: any) => {
      const {
        headers,
      } = req;

      const data = headers.Authorization
          ? headers
          : {
            ...headers,
            Authorization: `Bearer ${getToken()}`,
          };

      return {
        ...req,
        headers: data,
      };
    });

// TODO redirect to login when 401
HTTP.interceptors.response
    .use(
      (res: any) => res.data,
      (error: any) => {
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
