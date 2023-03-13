export function rng(min =0, max =100,float =false) {
  if ( float ) return Math.random() * (max - min) + min
  return Math.floor(Math.random() * (max - min) + min)
}
