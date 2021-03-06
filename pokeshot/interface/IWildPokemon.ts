import { TGender } from "~/types/gender";
import { TPokemonType } from "~/types/pokemonType";
import { TStatusAilment } from "./IOnButtle";

export interface IBase {
  id: number;
  name: string;
  type: TPokemonType[];
  imageUrl: string;
  gender: TGender;
}

export interface IMove {
  id: number;
  name: string;
  accuracy: number;
  pp: number;
  priority: number;
  power: number;
  type: TPokemonType;
} 

export interface IStats {

  // HP
  hp: number;

  // こうげき
  attack: number;

  // ぼうぎょ
  defense: number;

  // とくこう
  specialAttack: number;

  // とくぼう
  specialDefense: number;

  // すばやさ
  speed: number;
}

interface IWildPokemon {
  base: IBase;

  moves: IMove[];

  baseExperience: number;

  level: number;

  stats: IStats;

  remainHp: number;

  // 個体値
  individualStats: number;

  // 努力値
  effortStats: number;

  // 状態異常ステータス
  statusAilment: TStatusAilment | null;
}
export default IWildPokemon;