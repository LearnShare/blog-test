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
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

HTTP.interceptors.response
    .use(
      (res: any) => res.data,
      (error: any) => {
        const {
          status,
          message,
          response,
        } = error;

        if (status === 401) {
          window.localStorage.removeItem(TOKEN_KEY);

          const {
            pathname,
            search,
          } = window.location;

          if (!pathname.startsWith('/sign-in')) {
            const redirect = encodeURI(`${pathname}${search}`);

            window.location.href = `/sign-in?redirect=${redirect}`;
          }
        }

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
