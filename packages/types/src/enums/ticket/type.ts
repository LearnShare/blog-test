import {
  transformData,
} from '../../lib';

const data = [
  ['POST', '文章审核'],
];

const {
  options: TicketTypeOptions,
  names: TicketTypeNames,
  enums: TicketTypeEnums,
} = transformData(data);

export {
  TicketTypeOptions,
  TicketTypeNames,
  TicketTypeEnums,
};

export type TicketType = keyof typeof TicketTypeNames;
