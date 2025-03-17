import Validator from '@packages/lib/validator';

type ValidateResult = string | null;

function validateEmail(email: string): ValidateResult {
  if (!email) {
    return '请输入邮箱';
  }

  if (!Validator.validateEmail(email).success) {
    return '请输入有效的邮箱地址';
  }

  return null;
}

function validatePassword(password: string): ValidateResult {
  if (!password) {
    return '请输入密码';
  }

  if (!Validator.validatePassword(password).success) {
    return '请输入有效的密码';
  }

  return null;
}

function validateUid(uid: string): ValidateResult {
  if (!uid) {
    return '请输入 UID';
  }

  if (!Validator.validateUid(uid).success) {
    return '请输入有效的 UID';
  }

  return null;
}

export {
  validateEmail,
  validatePassword,
  validateUid,
};
