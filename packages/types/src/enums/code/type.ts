// Code.type

import {
  transformData,
} from '../../lib';

const data = [
  ['ACCOUNT_VERIFICATION', '账号激活'],
  ['RESET_PASSWORD', '重置密码'],
];

const {
  options: CodeTypeOptions,
  names: CodeTypeNames,
  enums: CodeTypeEnums,
} = transformData(data);

export {
  CodeTypeOptions,
  CodeTypeNames,
  CodeTypeEnums,
};

export type CodeType = keyof typeof CodeTypeNames;
