import Crypto from 'node:crypto';
import Bcrypt from 'bcrypt';
import {
  customAlphabet,
} from 'nanoid';

const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-1234567890_abcdefghijklmnopqrstuvwxyz';
const NanoId = customAlphabet(dict, 12);

function generateRandomNumber(length: number): string {
  const num = Crypto.webcrypto.getRandomValues(new Uint32Array(1));

  return String(num).substring(0, length);
}

function hashData(data: Crypto.BinaryLike): string {
  return Crypto.hash('sha256', data);
}

function uuid(): string {
  return Crypto.randomUUID();
}

function nanoid(length = 12): string {
  return NanoId(length);
}

function hashPassword(password: string): string {
  const saltRounds = 12;

  return Bcrypt.hash(password, saltRounds);
}

function checkPassword(password: string, hash: string): boolean {
  return Bcrypt.compare(password, hash);
}

export default {
  generateRandomNumber,
  hashData,
  uuid,
  nanoid,
  hashPassword,
  checkPassword,
};
