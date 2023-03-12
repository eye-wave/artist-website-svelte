export function validateNumber(input: number|string|undefined|null,min: number,max: number, _default: number):number {
  const num = +(input || 0) || 0
  if ( num < min || num > max ) return _default
  return num
}
