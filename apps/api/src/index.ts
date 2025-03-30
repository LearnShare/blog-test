import Dotenv from 'dotenv';
import express, {
  Express,
  Request,
  Response,
} from 'express';
import {
  rateLimit,
} from 'express-rate-limit';
import cors from 'cors';

import Auth from './lib/auth';

Dotenv.config();

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
});

import log from '@/lib/log';
import router from '@/router';
import error from '@/lib/error';
import Redis from '@/lib/redis';

const app: Express = express();
const port: number = 3000;

app.use(cors());
// rate-limit: 100 req in 5min
app.use(rateLimiter);
// JSON body parser
app.use(express.json());
// log request
app.use(log);
// token
app.use(Auth.auto);
// router modules
app.use(router);
// error
app.use(error);

app.listen(port, () => {
  console.log(`[API]: ready, port: ${ port }`, '\n');
});
