import HTTP from '../../http';

function signUp(email: string, password: string) {
  return HTTP.post('/auth/sign-up', {
    email,
    password,
  });
}

function signIn(email: string, password: string) {
  return HTTP.post('/auth/sign-in', {
    email,
    password,
  });
}

function requestVerify() {
  return HTTP.get('/auth/verify');
}

function verifyAccount(code: string) {
  return HTTP.post('/auth/verify', {
    code,
  });
}

function forgotPassword(email: string) {
  return HTTP.post('/auth/forgot', {
    email,
  });
}

function resetPassword(token: string, password: string) {
  return HTTP.post('/auth/reset', {
    token,
    password,
  });
}

function accountInfo() {
  return HTTP.get('/auth/info');
}

function accountStats() {
  return HTTP.get('/auth/stats');
}

function updateInfo(name: string) {
  return HTTP.post('/auth/info', {
    name,
  });
}

function updatePassword(oldPassword: string, password: string) {
  return HTTP.post('/auth/info', {
    oldPassword,
    password,
  });
}

export default {
  signUp,
  signIn,
  requestVerify,
  verifyAccount,
  forgotPassword,
  resetPassword,
  accountInfo,
  accountStats,
  updateInfo,
  updatePassword,
};
