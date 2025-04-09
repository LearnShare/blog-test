const roleOptions = [
  {
    label: '全部类型',
    value: '*',
  },
  {
    label: '管理员',
    value: 'ADMIN',
  },
  {
    label: '文章作者',
    value: 'AUTHOR',
  },
  {
    label: '普通用户',
    value: 'USER',
  },
];

const roles: Record<string, string> = {};
for (const option of roleOptions) {
  if (option.value !== '*') {
    roles[option.value] = option.label;
  }
}

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
