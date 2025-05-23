import express, {
  Express,
  Request,
  Response,
} from 'express';
import {
  rateLimit,
} from 'express-rate-limit';
import cors from 'cors';
import Sentry from '@sentry/node';

import '@/lib/dotenv';
import './instrument';

import log from '@/lib/log';
import router from '@/router';
import error from '@/lib/error';
import Auth from '@/lib/auth';

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 300,
});

const app: Express = express();

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

// rate-limit: 300 req in 5min
app.use(rateLimiter);
app.set('trust proxy', 1);
// JSON body parser
app.use(express.json());
// log request
app.use(log);
// token
app.use(Auth.auto);

// Sentry
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// router modules
app.use('/admin/api', router);

// error
app.use(error);

const port: number = Number(process.env.SERVER_PORT) || 3090;

app.listen(port, () => {
  console.log(`[ADMIN-API]: ready, port: ${ port }`, '\n');
});
