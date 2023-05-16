export function rng(n1 = 10, n2: null | number = null, float = false) {
  const min = n2 === null ? 0 : n1
  const max = n2 === null ? n1 : n2

  if (float) return Math.random() * (max - min) + min
  return Math.floor(Math.random() * (max - min) + min)
}
