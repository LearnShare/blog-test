import type {
  Option,
} from './option';

function transformData(data: string[][]) {
  const options: Option<string>[] = [];
  const names: Record<string, string> = {};
  const enums: Record<string, string> = {};

  for (const role of data) {
    const [
      value,
      label,
    ] = role;

    options.push({
      label,
      value,
    });
    names[value] = label;
    enums[value] = value;
  }

  return {
    options,
    names,
    enums,
  };
}

export {
  transformData,
};
