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

const ZodPassword = z.string()
    .min(6);
/**
 * validate password string
 * @param password string
 */
function validatePassword(password: string) {
  return ZodPassword.safeParse(password);
}

export default {
  validateEmail,
  validatePassword,
};
