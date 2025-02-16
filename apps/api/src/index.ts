import Dotenv from 'dotenv';
import express, {
  Express,
  Request,
  Response,
} from 'express';

Dotenv.config();

import log from '@/lib/log';
import router from '@/router';
import error from '@/lib/error';

const app: Express = express();
const port: number = 3000;

// JSON body parser
app.use(express.json());
// log request
app.use(log);
// router modules
app.use(router);
// error
app.use(error);

app.listen(port, () => {
  console.log(`Blog server running, port: ${ port }`, '\n');
});
