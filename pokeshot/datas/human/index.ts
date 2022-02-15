import { toukaJoi } from "./cities/touka/joi";
import { kaori } from "./cities/touka/kaori";
import { yoshihiko } from "./cities/touka/yoshihiko";
import { reportSystem } from "./sustem";
import { THuman } from "./types";

const humans: THuman[] = [
  toukaJoi,
  kaori,
  yoshihiko,
  reportSystem
];

export default humans;