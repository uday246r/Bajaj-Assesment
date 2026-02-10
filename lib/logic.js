
function fibonacci(n) {
  if (n == null || typeof n !== 'number' || !Number.isInteger(n) || n < 0) return null;
  if (n === 0) return [0];
  const out = [0, 1];
  for (let i = 2; i <= n; i++) out.push(out[i - 1] + out[i - 2]);
  return out;
}

function isPrime(x) {
  if (x < 2 || !Number.isInteger(x)) return false;
  if (x === 2) return true;
  if (x % 2 === 0) return false;
  for (let d = 3; d * d <= x; d += 2) if (x % d === 0) return false;
  return true;
}

function primesFromArray(arr) {
  if (!Array.isArray(arr)) return null;
  const out = [];
  for (const v of arr) {
    const n = Number(v);
    if (Number.isInteger(n) && n >= 0 && isPrime(n)) out.push(n);
  }
  return out;
}

function gcd(a, b) {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));
  while (b) [a, b] = [b, a % b];
  return a;
}

function lcmOfTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.floor(a) * Math.floor(b)) / gcd(a, b);
}

function lcmOfArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  let result = Math.abs(Math.floor(Number(arr[0])));
  if (!Number.isInteger(result) || result < 0) return null;
  for (let i = 1; i < arr.length; i++) {
    const n = Math.floor(Number(arr[i]));
    if (!Number.isInteger(n) || n < 0) return null;
    result = lcmOfTwo(result, n);
  }
  return result;
}

function hcfOfArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  let result = Math.abs(Math.floor(Number(arr[0])));
  if (!Number.isInteger(result)) return null;
  for (let i = 1; i < arr.length; i++) {
    const n = Math.floor(Number(arr[i]));
    if (!Number.isInteger(n)) return null;
    result = gcd(result, n);
  }
  return result;
}

module.exports = {
  fibonacci,
  primesFromArray,
  lcmOfArray,
  hcfOfArray,
};
