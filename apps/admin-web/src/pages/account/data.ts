import {
  type Option,
  AccountRoleOptions,
  AccountRoleNames,
} from '@packages/types';

const roleOptions: Option<string>[] = [
  {
    label: '全部类型',
    value: '*',
  },
  ...AccountRoleOptions,
];

const roles = {
  ...AccountRoleNames,
};

const disabledOptions = [
  {
    label: '全部状态',
    value: '*',
  },
  {
    label: '正常',
    value: '0',
  },
  {
    label: '已禁用',
    value: '1',
  },
];

const disabledNames: Record<string, string> = {};
for (const option of disabledOptions) {
  if (option.value !== '*') {
    disabledNames[option.value] = option.label;
  }
}

export {
  roleOptions,
  roles,
  disabledOptions,
  disabledNames,
};
