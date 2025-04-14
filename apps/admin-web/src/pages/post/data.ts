import {
  type Option,
  PostStatusOptions,
  PostStatusNames,
} from '@packages/types';

const statusOptions: Option<string>[] = [
  {
    label: '全部',
    value: '*',
  },
  ...PostStatusOptions,
];

const statusNames = {
  ...PostStatusNames,
};

export {
  statusOptions,
  statusNames,
};
