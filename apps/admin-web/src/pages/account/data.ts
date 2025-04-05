const roleOptions = [
  {
    label: '全部',
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

const roles = {};
for (const option of roleOptions) {
  if (option.value !== '*') {
    roles[option.value] = option.label;
  }
}

export {
  roleOptions,
  roles,
};
