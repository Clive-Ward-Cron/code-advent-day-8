import path from "path";
import fs from "fs";
import p1 from "./Part1.js";

const RUN = "input";
// const RUN = "test";

// Take the text input and split the lines,
// then split the line by " | " and get the
// the unique signal pattern (usp) and output,
// for each line and create an array of objects
const input = fs.readFileSync(path.join(process.cwd(), "data", `${RUN}.txt`), { encoding: "utf-8" }).split("\r\n");

// console.log(input);
p1(input);
