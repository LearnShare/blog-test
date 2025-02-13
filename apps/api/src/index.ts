import Dotenv from 'dotenv';
import express, {
  Express,
  Request,
  Response,
} from 'express';

Dotenv.config();

import log from '@/log';
import router from '@/router';

const app: Express = express();
const port: number = 3000;

// JSON body parser
app.use(express.json());
// log request
app.use(log);
// router modules
app.use(router);

app.listen(port, () => {
  console.log(`Blog server running, port: ${ port }`);
});
