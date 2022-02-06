import { TField, TFieldObject } from "../types";
import { load101Fields, load101Objects } from "./101";

export type TLoad = {
  id: number,
  fields: TField[],
  objects: (TFieldObject | null)[]
};

const loads: TLoad[] = [{
  id: 101,
  fields: load101Fields,
  objects: load101Objects
}];

export default loads;