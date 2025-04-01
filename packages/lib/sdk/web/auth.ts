import HTTP from '../../http';
import type {
  PostsQuery,
} from './post';

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

function updateInfo(data: {
  name?: string;
  uid?: string;
  intro?: string;
}) {
  return HTTP.put('/auth/info', data);
}

function updatePassword(oldPassword: string, password: string) {
  return HTTP.put('/auth/password', {
    oldPassword,
    password,
  });
}

function getPosts(query: PostsQuery) {
  return HTTP.get('/auth/post', {
    params: query,
  });
}

function getPost(uid: string) {
  return HTTP.get(`/auth/post/${uid}`);
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
  getPosts,
  getPost,
};
