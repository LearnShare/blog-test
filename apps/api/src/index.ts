import Dotenv from 'dotenv';
import express, {
  Express,
  Request,
  Response,
} from 'express';

Dotenv.config();

import router from '@/router';

const app: Express = express();
const port: number = 3000;

// JSON body parser
app.use(express.json());
// router modules
app.use(router);

app.listen(port, () => {
  console.log(`Blog server running, port: ${ port }`);
});
