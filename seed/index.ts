import Hash from '@packages/lib/hash';
import DB from '@packages/database';

const accounts = [
  {
    email: 'admin@test.com',
    password: '11223344',
    role: 'ADMIN',
  },
  {
    email: 'author@test.com',
    password: '11223344',
    role: 'AUTHOR',
  },
  {
    email: 'user@test.com',
    password: '11223344',
    role: 'USER',
  },
];

async function createAccounts() {
  for (const account of accounts) {
    const {
      email,
      password,
      role,
    } = account;

    const hash = await Hash.hashPassword(password);

    const {
      data,
      error,
    } = await DB.account.createAccount({
      email,
      password: hash,
      role,
      verified: true,
  });

    if (error) {
      console.error('[SEED]:', `create account "${email}" error`);
    }

    if (data) {
      console.log('[SEED]:', `account "${email}" created`);
    }
  }
}

createAccounts();
