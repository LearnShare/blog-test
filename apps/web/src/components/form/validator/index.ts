import Validator from '@packages/lib/validator';

function validateEmail(email: string): string {
  if (!email) {
    return '请输入邮箱';
  }

  if (!Validator.validateEmail(email).success) {
    return '请输入有效的邮箱地址';
  }

  return '';
}

function validatePassword(password: string): string {
  if (!password) {
    return '请输入密码';
  }

  if (!Validator.validatePassword(password).success) {
    return '请输入有效的密码';
  }

  return '';
}

function validateUid(uid: string): string {
  if (!uid) {
    return '请输入 UID';
  }

  if (!Validator.validateUid(uid).success) {
    return '请输入有效的 UID';
  }

  return '';
}

export {
  validateEmail,
  validatePassword,
  validateUid,
};
