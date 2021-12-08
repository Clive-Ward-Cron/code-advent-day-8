export function occurrences(arr) {
  return arr.reduce((p, c) => {
    if (c in p) {
      p[c]++;
    } else {
      p[c] = 1;
    }
    return p;
  }, {});
}
