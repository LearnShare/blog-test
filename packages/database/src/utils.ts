export function searchInMultipleCol(search: string, cols: string[], operator: string = 'contains') {
  const query = cols.map((col) => ({
    [col]: {
      [operator]: search,
    },
  }));

  return {
    OR: query,
  };
}
