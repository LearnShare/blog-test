// Post.format

import {
  transformData,
} from '../../lib';

const data = [
  ['TEXT', '文本'],
  ['MARKDOWN', 'Markdown'],
];

const {
  options: PostContentFormatOptions,
  names: PostContentFormatNames,
  enums: PostContentFormatEnums,
} = transformData(data);

export {
  PostContentFormatOptions,
  PostContentFormatNames,
  PostContentFormatEnums,
};

export type PostContentFormat = keyof typeof PostContentFormatNames;
