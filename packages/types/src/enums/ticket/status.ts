import {
  transformData,
} from '../../lib';

const data = [
  ['PENDING', '待审核'],
  ['APPROVED', '审核通过'],
  ['REJECTED', '已拒绝'],
];

const {
  options: TicketStatusOptions,
  names: TicketStatusNames,
  enums: TicketStatusEnums,
} = transformData(data);

export {
  TicketStatusOptions,
  TicketStatusNames,
  TicketStatusEnums,
};

export type TicketStatus = keyof typeof TicketStatusNames;
