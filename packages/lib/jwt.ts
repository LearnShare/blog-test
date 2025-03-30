import JWT from 'jsonwebtoken';
import type {
  StringValue,
} from 'ms';

function encrypt(data: any) {
  return JWT.sign(data, process.env.JWT_SECRET as JWT.Secret, {
    expiresIn: process.env.JWT_EXPIRES as StringValue,
  });
}

function decrypt(token: string) {
  return JWT.verify(token, process.env.JWT_SECRET as string);
}

export default {
  encrypt,
  decrypt,
};
