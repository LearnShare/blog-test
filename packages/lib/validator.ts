import {
  z,
} from 'zod';

const ZodEmail = z.string().email()
    .min(8);
/**
 * validate email string
 * @param email string
 */
function validateEmail(email: string) {
  return ZodEmail.safeParse(email);
}

const passwordReg = /^[A-Za-z0-9~!@#$%^&*+-_=]{8,20}$/;

const ZodPassword = z.string()
    .min(8)
    .max(20)
    .regex(passwordReg);
/**
 * validate password string
 * @param password string
 */
function validatePassword(password: string) {
  return ZodPassword.safeParse(password);
}

const uidReg = /^[A-Za-z0-9-_]{4,16}$/;
const ZodUid = z.string()
    .min(4)
    .max(16)
    .regex(uidReg);
/**
 * validate uid string
 * @param uid string
 */
function validateUid(uid: string) {
  return ZodUid.safeParse(uid);
}

export default {
  validateEmail,
  validatePassword,
  validateUid,
};
