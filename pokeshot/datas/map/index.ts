import { TField, TFieldObject } from "./types";
import { load101Fields, load101Objects } from "./loads/load101";

export type TMap = {
  id: string,
  fields: TField[],
  objects: (TFieldObject | null)[]
};

const loads: TMap[] = [{
  id: 'load101',
  fields: load101Fields,
  objects: load101Objects
}];

export default loads;