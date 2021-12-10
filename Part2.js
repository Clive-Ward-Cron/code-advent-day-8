//! TEST DATA
const SOLVED_SEVEN_SEGMENT = {
  1: 'd',
  2: 'e',
  3: 'a',
  4: 'f',
  5: 'g',
  6: 'b',
  7: 'c',
};

const DECODED_SIGNAL = {
  usp: 'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab',
  output: 'cdfeb fcadb cdfeb cdbaf',
  key: {
    acedgfb: 8,
    cdfbe: 5,
    gcdfa: 2,
    fbcad: 3,
    dab: 7,
    cefabd: 9,
    cdfgeb: 6,
    eafb: 4,
    cagedb: 0,
    ab: 1,
  },
  display: { 1: 'd', 2: 'e', 3: 'a', 4: 'f', 5: 'g', 6: 'b', 7: 'c' },
};

// NEED TO SORT KEY PROPERTIES;
const keySort = Object.entries(DECODED_SIGNAL.key).reduce((p, [key, value]) => {
  p[key.split('').sort().join('')] = value;
  return p;
}, {});

// console.log(keySort);
DECODED_SIGNAL.key = keySort;
//!

// These numbers correspond to the number of
// segments used in the numbers 1, 7, 4, and 8 respectively
const UNIQUE = { 2: 1, 3: 7, 4: 4, 7: 8 };

// Base object for a Seven Segment,
// Could look like {1: "d", 2: "e", 3: "a", 4: "f", 5: "g", 6: "b", 7: "c"}
// This would create a pattern like below:
//                                          dddd
//                                         e    a
//                                         e    a
//                                          ffff
//                                         g    b
//                                         g    b
//                                          cccc
const SEVEN_SEGMENT = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' };
const DIGITS = [
  '1110111', // 0
  '0010010', // 1
  '1011101', // 2
  '1011011', // 3
  '0111010', // 4
  '1101011', // 5
  '1101111', // 6
  '1010010', // 7
  '1111111', // 8
  '1111011', // 9
];

function printOutput(signal) {
  const s = { 1: 'd', 2: 'e', 3: 'a', 4: 'f', 5: 'g', 6: 'b', 7: 'c' };
  const eight = 'abcdefg';
  const four = 'abef';
  let l = eight.split('');
  let stdout = `
 ${l.includes(s[1]) ? s[1] : ' '}${l.includes(s[1]) ? s[1] : ' '}${
    l.includes(s[1]) ? s[1] : ' '
  }${l.includes(s[1]) ? s[1] : ' '}
${l.includes(s[2]) ? s[2] : ' '}    ${l.includes(s[3]) ? s[3] : ' '}
${l.includes(s[2]) ? s[2] : ' '}    ${l.includes(s[3]) ? s[3] : ' '}
 ${l.includes(s[4]) ? s[4] : ' '}${l.includes(s[4]) ? s[4] : ' '}${
    l.includes(s[4]) ? s[4] : ' '
  }${l.includes(s[4]) ? s[4] : ' '}
${l.includes(s[5]) ? s[5] : ' '}    ${l.includes(s[6]) ? s[6] : ' '}
${l.includes(s[5]) ? s[5] : ' '}    ${l.includes(s[6]) ? s[6] : ' '}
 ${l.includes(s[7]) ? s[7] : ' '}${l.includes(s[7]) ? s[7] : ' '}${
    l.includes(s[7]) ? s[7] : ' '
  }${l.includes(s[7]) ? s[7] : ' '}
`;
  return stdout;
}

function mapSignalOutput(arr) {
  return arr.map((l) => {
    const signalOutput = l.split(' | ');
    return { usp: signalOutput[0], output: signalOutput[1] };
  });
}

function decodeOut(out, key) {
  return out.split(' ').reduce((p, d) => {
    // console.log(key);
    return `${p}${key[d.split('').sort().join('')]}`;
  }, '');
}

function decodeUSP(usp) {
  // Copy a base Seven Segment to track
  // which wires correspond to what segment;
  // const sevenSeg = { ...SEVEN_SEGMENT };
  const seg = ['', '', '', '', '', '', ''];

  // Create an object to be a key
  // for the decyphered pattern
  // Ex. {"ab": 1, "abg": 7, "abcf": 4, (etc...)}
  const key = {};

  // Sort Each Pattern,
  const digits = usp.split(' ').sort((a, b) => a.length - b.length);

  // Loop through the patterns and update the key map
  // to have the correct numbers with unique values
  digits.forEach((d) => {
    // Need to sort the digit alphabetically
    d = d.split('').sort().join('');
    if (d.length in UNIQUE) {
      key[d] = UNIQUE[d.length];
    } else {
      key[d] = null;
    }
  });

  const one = Object.entries(key).find(([key, value]) => {
    return value === 1;
  })[0];
  const four = Object.entries(key).find(([key, value]) => {
    return value === 4;
  })[0];
  const seven = Object.entries(key).find(([key, value]) => {
    return value === 7;
  })[0];

  seg[0] = findSegZero(seven, one);

  let len5 = digits
    .filter((d) => d.length === 5)
    .map((d) => d.split('').sort().join(''));
  let seg6Num3 = findSegSix(len5, one, four, seg[0]);

  seg[6] = seg6Num3[0];
  const three = seg6Num3[1];
  key[three] = 3;

  len5 = len5.filter((d) => {
    return d !== three;
  });

  const seg2seg5Five = findSeg2And5(len5, one, four, seg);

  seg[2] = seg2seg5Five[0];
  seg[5] = seg2seg5Five[1];

  const five = seg2seg5Five[2];
  key[five] = 5;

  len5 = len5.filter((d) => {
    return d !== five;
  });

  const two = len5[0];
  key[two] = 2;

  // console.log(findSeg134(two, four, seg));
  const seg134 = findSeg134(two, four, seg);
  seg[1] = seg134[0];
  seg[3] = seg134[1];
  seg[4] = seg134[2];

  let remaining = Object.entries(key).filter(([key, value]) => {
    return !value;
  });
  remaining = remaining.map((el) => {
    return el[0];
  });
  // console.log(remaining);

  let zero = null;
  let six = null;
  let nine = null;
  remaining.forEach((p) => {
    console.log('six or nine');
    console.log(p);
    if (p.indexOf(seg[3]) === -1) {
      zero = p;
      key[zero] = 0;
    } else if (p.indexOf(seg[2]) === -1) {
      six = p;
      key[six] = 6;
    } else {
      nine = p;
      key[nine] = 9;
    }
  });

  // console.log(seg);
  // console.log(key);
  return [key, seg];
}

function findSeg134(two, four, seg) {
  let seg1 = null;
  let seg3 = null;
  let seg4 = null;
  let stripped2 = two.replace(seg[0], '');
  stripped2 = stripped2.replace(seg[2], '');
  stripped2 = stripped2.replace(seg[6], '');

  if (four.includes(stripped2[0])) {
    seg3 = stripped2[0];
    seg4 = stripped2[1];
  } else {
    seg3 = stripped2[1];
    seg4 = stripped2[0];
  }

  let stripped4 = four.replace(seg[2], '');
  stripped4 = stripped4.replace(seg3, '');
  seg1 = stripped4.replace(seg[5], '');

  return [seg1, seg3, seg4];
}

function findSeg2And5(len5, one, four, seg) {
  let seg2 = null;
  let seg5 = null;
  let five = '';
  for (let p of len5) {
    let chars = p.split('');
    let oneChars = one.split('');
    let fourChars = four.split('');
    if (
      (!p.includes(oneChars[0]) && p.includes(oneChars[1])) ||
      (!p.includes(oneChars[1]) && p.includes(oneChars[0]))
    ) {
      let minusChars = p.replace(oneChars[0], '');
      minusChars = minusChars.replace(oneChars[1], '');
      minusChars = minusChars.replace(seg[0], '');
      minusChars = minusChars.replace(seg[6], '');
      const c = minusChars.split('');
      // console.log(four.includes(minusChars[1]));
      if (four.includes(minusChars[0]) && four.includes(minusChars[1])) {
        console.log(oneChars);
        console.log(p);
        if (p.includes(oneChars[0])) {
          seg5 = oneChars[0];
          seg2 = oneChars[1];
        } else {
          seg5 = oneChars[1];
          seg2 = oneChars[0];
        }
        five = p;
      }
    }
  }
  return [seg2, seg5, five];
}

function findSegSix(len5, one, four, seg0) {
  let segSix = null;
  let three = '';
  for (let p of len5) {
    let chars = p.split('');
    let oneChars = one.split('');
    let fourChars = four.split('');
    if (chars.includes(seg0)) {
      if (chars.includes(oneChars[0]) && chars.includes(oneChars[1])) {
        for (let l of chars) {
          if (l !== seg0 && !oneChars.includes(l) && !fourChars.includes(l)) {
            segSix = l;
            three = p;
          }
        }
      }
    }
  }
  return [segSix, three];
}

function findSegZero(seven, one) {
  let zero = null;
  for (let char of seven.split('')) {
    if (!one.split('').includes(char)) {
      zero = char;
    }
  }
  return zero;
}

function p2(input) {
  const patternMap = mapSignalOutput(input);

  patternMap.forEach((m, i) => {
    let keySeg = decodeUSP(m.usp);
    m['key'] = keySeg[0];
    m['seg'] = keySeg[1];
    console.log(m);
  });

  // console.log(patternMap);
  let outputs = patternMap.map((m) => {
    return parseInt(decodeOut(m.output, m.key));
  });
  console.log(outputs);

  let count = outputs.reduce((p, n) => {
    return p + n;
  }, 0);

  console.log(count);
  // console.log(patternMap);
  // console.log(UNIQUE);
  // console.log(DECODED_SIGNAL);
  // console.log(printOutput(1));

  // console.log(decodeOut(DECODED_SIGNAL.output, DECODED_SIGNAL.key));

  // const signals = patternMap.map((p) => p.usp);
  // const output = patternMap.map((o) => o.output);

  // Take only the output patterns,
  // take each pattern, split it out as
  // an array of the lengths of the sub-patterns,
  // filter out all but the patterns that
  // correspond to 1, 4, 7, or 8
  // flatten it down to a single array level
  /*
  const allOutputPatternsLengths = output
    .map((o) =>
      o
        .split(" ")
        .map((p) => p.length)
        .filter((n) => UNIQUE.includes(n))
        .flat()
    )
    .flat();
  */
  // console.log(output);
  // console.log(count);
  // console.log(allOutputPatternsLengths.length);
}

export default p2;
