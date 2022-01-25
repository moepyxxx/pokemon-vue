import { TGeneration, TNameProp, TNameUrlPair, TVersion } from "./common";

type TColor = TNameUrlPair;

type TEggGroup = TNameUrlPair;

type TLanguage = TNameUrlPair;

type TGrouthRate = TNameUrlPair;

type THabitat = TNameUrlPair;

type TPokedex = TNameUrlPair;

type TPokemon = TNameUrlPair;

type TArea = TNameUrlPair;

type TShape = TNameUrlPair;

export type TName = {
  language: TLanguage,
  name: TNameProp
};

type TFlavorTextEntrie = {
  flavor_text: string,
  language: TLanguage,
  version: TVersion
}

type TGenera = {
  genus: string,
  language: TLanguage
}

type TPalParkEncounter = {
  area: TArea,
  base_score: number,
  rate: number
}

type TPokedexNumber = {
  pokedex: TPokedex,
  entry_number: string
}

type TVarietie = {
  pokemon: TPokemon,
  is_default: boolean
}

type IPokemonSpecies = {
  base_happiness: number,
  capture_rate: number,
  color: TColor,
  egg_group: TEggGroup[],
  flavor_text_entries: TFlavorTextEntrie[],
  form_descriptions: [],
  forms_switchable: boolean,
  gender_rate: number,
  genera: TGenera[],
  generation: TGeneration,
  growth_rate: TGrouthRate,
  habitat: THabitat,
  has_gender_differences:false
  hatch_counter: number,
  id: 252,
  is_baby: boolean,
  is_legendary: boolean,
  is_mythical: boolean,
  name: string,
  names: TName[],
  order: number,
  pal_park_encounters: TPalParkEncounter[],
  pokedex_numbers: TPokedexNumber[],
  shape: TShape,
  varieties: TVarietie[]
}
export default IPokemonSpecies;