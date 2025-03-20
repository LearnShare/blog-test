'use server';

import {
  cookies,
} from 'next/headers';

const COOKIE_NAME = 'BLOG_TOKEN';

export async function setCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token);

  return {};
}

export async function deleteCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);

  return {};
}
