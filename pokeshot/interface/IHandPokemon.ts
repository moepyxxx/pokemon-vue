import { IBase, IMove, IStats } from "./IWildPokemon";

interface IHandPokemon {
  base: IBase;

  moves: IMove[];

  baseExperience: number;

  level: number;

  stats: IStats;

  // 個体値
  individualStats: number;

  // 努力値
  effortStats: number;

  nickname: string;

}
export default IHandPokemon;