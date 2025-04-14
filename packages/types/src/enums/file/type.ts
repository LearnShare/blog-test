import {
  transformData,
} from '../../lib';

const data = [
  ['UNKNOWN', '未知'],
  ['IMAGE', '图片'],
];

const {
  options: FileTypeOptions,
  names: FileTypeNames,
  enums: FileTypeEnums,
} = transformData(data);

export {
  FileTypeOptions,
  FileTypeNames,
  FileTypeEnums,
};

export type FileType = keyof typeof FileTypeNames;
