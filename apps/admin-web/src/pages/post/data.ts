const statusOptions = [
  {
    label: '全部',
    value: '*',
  },
  {
    label: '已发布',
    value: 'public',
  },
  {
    label: '待审核',
    value: 'draft',
  },
  {
    label: '已拒绝',
    value: 'rejected',
  },
];

const statusNames: Record<string, string> = {};
for (const option of statusOptions) {
  if (option.value !== '*') {
    statusNames[option.value] = option.label;
  }
}

export {
  statusOptions,
  statusNames,
};
