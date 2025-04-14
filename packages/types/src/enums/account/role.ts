// Account.role

import {
  transformData,
} from '../../lib';

const data = [
  ['USER', '普通用户'],
  ['AUTHOR', '文章作者'],
  ['ADMIN', '管理员'],
];

const {
  options: AccountRoleOptions,
  names: AccountRoleNames,
  enums: AccountRoleEnums,
} = transformData(data);

export {
  AccountRoleOptions,
  AccountRoleNames,
  AccountRoleEnums,
};

export type AccountRole = keyof typeof AccountRoleNames;
