import { readFileSync } from 'fs';
const [a, b] = readFileSync(0).toString().trim().split(' ').map(Number);
console.log(a + b);