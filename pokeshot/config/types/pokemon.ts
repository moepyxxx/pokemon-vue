import { TPokemonType } from "~/types/pokemonType";
import { TGeneration, TNameUrlPair, TVersion } from "./common";

type TAbility = {
  is_hidden: boolean,
  slot: number,
  ability: TNameUrlPair
}

type TForm = TNameUrlPair;

type TGameIndices = {
  game_index: number,
  version: TVersion
}

type TItem = TNameUrlPair;

type TVersionDetails = {
  rarity: number,
  version: TVersion
}

type THeldItem = {
  item: TItem,
  version_details: TVersionDetails[]
}

type TVersionGroup = TNameUrlPair;

type TMoveLearnMethod = TNameUrlPair;

type TVersionDetailGroup = {
  level_learned_at: number,
  version_group: TVersionGroup,
}

type TMove = {
  move: TNameUrlPair,
  version_detail_groups: TVersionDetailGroup[],
  move_learn_method: TMoveLearnMethod
}

type TSpecies = TNameUrlPair;

type TStat = {
  base_stat: number,
  effort: number,
  stat: TNameUrlPair
}

type TType = {
  slot: number,
  type: {
    id: number,
    name: TPokemonType
  }
}

type TPastType = {
  generation: TGeneration,
  types: TType[]
}

type IPokemon = {
  id: number,
  name: string,
  base_experience: number,
  height: number,
  is_default: boolean,
  order: number,
  weight: number,
  abilities: TAbility[],
  forms: TForm[],
  game_indices: TGameIndices[],
  held_items: THeldItem[],
  location_area_encounters: string,
  moves: TMove[],
  species: TSpecies,
  stats: TStat[],
  types: TType[],
  past_types: TPastType[]
}
export default IPokemon;