import { TField, TFieldObject } from "./types";
import { load101Fields, load101Objects } from "./loads/load101";
import { toukaFields, toukaObjects } from "./cities/touka/";
import { toukaPcFields, toukaPcObjects } from "./cities/touka/pokemoncenter";

export type TMap = {
  id: string,
  name: string,
  fields: TField[],
  objects: (TFieldObject | null)[]
};

const maps: TMap[] = [{
  id: 'load101',
  name: '101ばんどうろ',
  fields: load101Fields,
  objects: load101Objects
}, {
  id: 'touka',
  name: 'トウカシティ',
  fields: toukaFields,
  objects: toukaObjects
}, {
  id: 'toukapokemoncenter',
  name: 'ポケモンセンター（トウカ）',
  fields: toukaPcFields,
  objects: toukaPcObjects
}];

export default maps;