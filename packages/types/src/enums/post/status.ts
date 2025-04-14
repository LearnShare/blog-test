import {
  transformData,
} from '../../lib';

const data = [
  ['PUBLIC', '已发布'],
  ['DRAFT', '待审核'],
  ['REJECTED', '已拒绝'],
];

const {
  options: PostStatusOptions,
  names: PostStatusNames,
  enums: PostStatusEnums,
} = transformData(data);

export {
  PostStatusOptions,
  PostStatusNames,
  PostStatusEnums,
};

export type PostStatus = keyof typeof PostStatusNames;
