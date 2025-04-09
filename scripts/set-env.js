import fs from 'node:fs';

const envName = process.argv[2];

const fromPath = './.envs/';
const toPath = './';

const envFiles = [
  'apps/api/.env',
  'apps/web/.env',
  'apps/admin-api/.env',
  'apps/admin-web/.env',
  'packages/database/.env',
  ".env",
];

function run() {
  const from = `${fromPath}${envName}`;

  console.log(`[env]: start`);

  try {
    for (const file of envFiles) {
      fs.copyFileSync(`${from}/${file}`, `${toPath}/${file}`);
      console.log(`[env]: copy ${file}`);
    }
  } catch (error) {
    console.log(error);
  }

  console.log(`[env]: end`);
}

run();
