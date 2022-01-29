import { TStatusAilment } from "./IOnButtle";
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

  // 状態異常ステータス
  statusAilment: TStatusAilment | null;
}
export default IHandPokemon;