import { TPokemonType } from "~/types/pokemonType";
import { TGeneration, TNameProp, TNameUrlPair, TVersion } from "./common";
import { TName } from "./pokemonSpecies";

type TContestCombosUse = TNameUrlPair;

type TContestCombos = {
  normal: {
    use_after: TContestCombosUse[] | null,
    use_before: TContestCombosUse[] | null
  },
  super: {
    use_after: TContestCombosUse[] | null,
    use_before: TContestCombosUse[] | null
  }
}

type TContestType = TNameUrlPair;

type TContestEffect = TNameUrlPair;

type TContestClass = TNameUrlPair;

type TType = {
  url: string;
  name: TPokemonType
};

type IApiMove = {
  id: number,
  contest_combos: TContestCombos,
  contest_type: TContestType,
  contest_class: TContestClass,
  contest_effect: TContestEffect,
  name: string,
  accuracy: number,
  effect_chance: null
  pp: number,
  priority: number,
  power: number,
  names: TName[],
  type: TType
}
export default IApiMove;