export type TPokemonType = 
  'flying' |
  'fighting' |
  'poison' |
  'ground' |
  'lock' |
  'bug' |
  'steel' |
  'normal' |
  'water' |
  'fire' |
  'ghost' |
  'grass' |
  'psychic' |
  'electric' |
  'dragon' |
  'ice' |
  'dark' |
  'fairy' |
  'unknown' |
  'shadow'
;

export function isTPokemonType(arg: any): arg is TPokemonType {
  return arg !== undefined;
}