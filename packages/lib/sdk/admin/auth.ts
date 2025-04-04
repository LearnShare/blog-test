import HTTP from '../../http';

function signIn(email: string, password: string) {
  return HTTP.post('/auth/sign-in', {
    email,
    password,
  });
}

export default {
  signIn,
};
