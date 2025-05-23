import dayjs from 'dayjs';

const dateRule = 'YYYY-MM-DD';
const timeRule = 'HH:mm:ss';

const rules = {
  datetime: `${dateRule} ${timeRule}`,
  'dt-short': `${dateRule} HH:mm`,
  date: dateRule,
  time: timeRule,
};

type RuleType = keyof (typeof rules);

function format(time: Date | string, rule: RuleType = 'datetime') {
  return dayjs(time).format(rules[rule]);
}

function formatRelative(time: Date | string): string {
  const now = new Date();
  const today = dayjs(now)
      .startOf('date')
      .valueOf();
  const yesterday = dayjs(now)
      .startOf('date')
      .subtract(1, 'day')
      .valueOf();

  const target = dayjs(time)
      .valueOf();

  let dateStr = dayjs(time).format(dateRule);
  const timeStr = dayjs(time).format('HH:mm');

  if (target >= today) {
    dateStr = '今天';
  } else if (target >= yesterday) {
    dateStr = '昨天';
  }

  return `${dateStr} ${timeStr}`;
}

export default {
  format,
  formatRelative,
};
