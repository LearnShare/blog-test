const statusOptions = [
  {
    label: '待审核',
    value: 'pending',
  },
  {
    label: '审核通过',
    value: 'approved',
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
