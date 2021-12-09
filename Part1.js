// These numbers correspond to the number of
// segments used in the numbers 1, 7, 4, and 8 respectively
const UNIQUE = [2, 3, 4, 7];
function p1(input) {
  const patternMap = input.map((l) => {
    const signalOutput = l.split(" | ");
    return { usp: signalOutput[0], output: signalOutput[1] };
  });

  // const signals = patternMap.map((p) => p.usp);
  const output = patternMap.map((o) => o.output);

  // Take only the output patterns,
  // take each pattern, split it out as
  // an array of the lengths of the sub-patterns,
  // filter out all but the patterns that
  // correspond to 1, 4, 7, or 8
  // flatten it down to a single array level
  const allOutputPatternsLengths = output
    .map((o) =>
      o
        .split(" ")
        .map((p) => p.length)
        .filter((n) => UNIQUE.includes(n))
        .flat()
    )
    .flat();

  // console.log(output);
  // console.log(count);
  console.log(allOutputPatternsLengths.length);
}

export default p1;
