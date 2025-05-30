const n = parseInt(require('fs').readFileSync(0).toString());
console.log(n % 2 === 0 ? 'Even' : 'Odd');