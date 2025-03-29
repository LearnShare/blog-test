import dayjs from 'dayjs';

const dateRule = 'YYYY-MM-DD';
const timeRule = 'HH:mm:ss';

const rules: Record<string, string> = {
  datetime: `${dateRule} ${timeRule}`,
  date: dateRule,
  time: timeRule,
};

function format(time: Date | string, rule = 'datetime') {
  return dayjs(time).format(rules[rule]);
}

export default {
  format,
};
