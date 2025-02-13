import Bcrypt from 'bcrypt';

function hashPassword(password: string): string {
  const saltRounds = 12;

  return Bcrypt.hash(password, saltRounds);
}

function checkPassword(password: string, hash: string): boolean {
  return Bcrypt.compare(password, hash);
}

export default {
  hashPassword,
  checkPassword,
};
