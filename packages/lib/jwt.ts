import JWT from 'jsonwebtoken';

function encrypt(data: any) {
  return JWT.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}

function decrypt(token: string) {
  return JWT.verify(token, process.env.JWT_SECRET);
}

export default {
  encrypt,
  decrypt,
};
