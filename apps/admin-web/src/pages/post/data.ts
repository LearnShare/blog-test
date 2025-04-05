const publishedOptions = [
  {
    label: '全部',
    value: '*',
  },
  {
    label: '公开',
    value: '1',
  },
  {
    label: '草稿',
    value: '0',
  },
];

const publishedNames: Record<string, string> = {};
for (const option of publishedOptions) {
  if (option.value !== '*') {
    publishedNames[option.value] = option.label;
  }
}

export {
  publishedOptions,
  publishedNames,
};
