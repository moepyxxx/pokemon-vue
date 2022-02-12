import { TField, TFieldObject } from "./types";
import { load101Fields, load101Objects } from "./loads/load101";
import { toukaFields, toukaObjects } from "./cities/touka/";
import { toukaPcFields, toukaPcObjects } from "./cities/touka/pokemoncenter";

export type TMap = {
  id: string,
  fields: TField[],
  objects: (TFieldObject | null)[]
};

const loads: TMap[] = [{
  id: 'load101',
  fields: load101Fields,
  objects: load101Objects
}, {
  id: 'touka',
  fields: toukaFields,
  objects: toukaObjects
}, {
  id: 'toukapokemoncenter',
  fields: toukaPcFields,
  objects: toukaPcObjects
}];

export default loads;