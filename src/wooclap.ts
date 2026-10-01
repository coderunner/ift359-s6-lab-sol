// CODE 1

let a = 5;
const x = 2;
function f(x: number): number {
  return a * x;
}
a = 10;
console.log(f(3));

// CODE 2

import { compte, retirer } from "./compte.js";

const c0 = compte("id", 100);
const [c1, r1] = retirer(c0, 25);
const [c2, r2] = retirer(c1, 25);
console.log(r2);
