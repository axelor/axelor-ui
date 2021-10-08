import faker from 'faker';

export const getId = (() => {
  let id = 0;
  return () => id++;
})();

export function getTitle() {
  return faker.lorem.words();
}

export function getRecords(count: number) {
  return Array.from({ length: count }, () => ({
    id: getId(),
    title: getTitle(),
  }));
}

export function getColumns(count: number, recordsCount: number) {
  return Array.from({ length: count }, () => ({
    id: getId(),
    title: getTitle(),
    records: getRecords(recordsCount),
  }));
}

export function getDefaultColumns() {
  return ['Todo', 'In-Progress', 'Completed'].map(title => ({
    id: getId(),
    title,
    records: getRecords(5),
  }));
}

export default getDefaultColumns;
