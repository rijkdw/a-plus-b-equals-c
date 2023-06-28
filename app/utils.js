export function sortKeysByValues(obj, ascending = true) {
  let sortable = [];
  for (const [key, value] of Object.entries(obj)) {
    sortable.push([key, value]);
  }
  sortable.sort((a, b) => (ascending ? 1 : -1) * (a[1] - b[1]));
  let keys = [];
  for (const arr of sortable) {
    keys.push(arr[0]);
  }
  return keys;
}
