import Validator from '@packages/lib/validator';

function validateEmail(email: string): string | boolean {
  if (!Validator.validateEmail(email).success) {
    return '请输入有效的邮箱地址';
  }

  return true;
}

function validatePassword(password: string): string | boolean {
  if (!Validator.validatePassword(password).success) {
    return '请输入有效的密码';
  }

  return true;
}

function validateUid(uid: string): string | boolean {
  if (!Validator.validateUid(uid).success) {
    return '请输入有效的 UID';
  }

  return true;
}

export {
  validateEmail,
  validatePassword,
  validateUid,
};
