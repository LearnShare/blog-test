import * as Sentry from '@sentry/nextjs';

const enabled = !!process.env.SENTRY_DSN;

export async function register() {
  if (!enabled) {
    return null;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError = enabled
    ? Sentry.captureRequestError
    : () => {};
