import { Plugin } from "@nuxt/types";
import { Context, Inject } from "@nuxt/types/app";
import { POKE_API_LANG_KEY, POKE_API_POKEMON_PATH, POKE_API_VERSION_KEY } from "~/config/pokeapi";
import IApiPokemon, { TSpritesKey } from "~/config/types/pokemon";
import IApiPokemonSpecies, { TName } from "~/config/types/pokemonSpecies";
import IApiMove from "~/config/types/move";
import IWildPokemon, { IMove, IStats } from "~/interface/IWildPokemon";
import { TGender } from "~/types/gender";
import { TPokemonType } from "~/types/pokemonType";
import { PokeApi } from './pokeapi';

const definePoke: Plugin = ( ctx: Context, inject: Inject ) => {

  const pokeApi: PokeApi = new PokeApi(ctx.$axios);
  inject('Poke', new Poke(pokeApi));
}
export default definePoke

class Poke {

  pokeApi: PokeApi;

  pokemonPath: string = POKE_API_POKEMON_PATH;

  constructor (pokeApi: PokeApi) {
    this.pokeApi = pokeApi;
  }

  async getWildPokemon(pokemonId: number, level: number) : Promise<IWildPokemon> {
    const pokemon: IApiPokemon = await this.pokeApi.getPokemonFromId(pokemonId);
    const pokemonSpecies: IApiPokemonSpecies = await this.pokeApi.getPokemonSpeciesFromId(pokemonId);

    const name: string = this.getJaName(pokemonSpecies.names);
    const id: number = pokemon.id;
    const type: TPokemonType[] = this.getPokemonTypes(pokemon);
    const imageUrl: string = this.getImage(pokemon, 'front_default');
    const gender: TGender = this.getGender();
    const individualStats: number = this.getIndividualStats();
    const stats: IStats = this.getStats(pokemon, level, individualStats);
    const moves: IMove[] = await this.getMoves(pokemon, level);
    return {
      base: {
        id,
        name,
        type,
        imageUrl,
        gender
      },
      moves,
      stats,
      individualStats,
      effortStats: 0,
      level,
      baseExperience: pokemon.base_experience
    }
  }

  getJaName(names: TName[]): string {
    const nameObj: TName = names.find( (nameobj: TName ) => {
      const isJaNameObj: boolean = nameobj.language.name === POKE_API_LANG_KEY;
      if (!isJaNameObj) return false;
      return true;
    }) as TName;
    return nameObj.name;
  }

  getPokemonTypes(pokemon: IApiPokemon): TPokemonType[] {
    return pokemon.types.map(typeObj => typeObj.type.name);
  }

  getImage(pokemon: IApiPokemon, key: TSpritesKey) {
    return pokemon.sprites[key];
  }

  getGender(): TGender {
    const rand = Math.random();
    return rand < 0.5 ? 'オス' : 'メス';
  }

  getStats(pokemon: IApiPokemon, level: number, individualStats: number, effortStats = 0): IStats {
    const baseHp: number = pokemon.stats.find(stats => stats.stat.name === 'hp')?.base_stat as number;
    const baseAttack: number = pokemon.stats.find(stats => stats.stat.name === 'attack')?.base_stat as number;
    const baseDefense: number = pokemon.stats.find(stats => stats.stat.name === 'defense')?.base_stat as number;
    const baseSpecialAttack: number = pokemon.stats.find(stats => stats.stat.name === 'special-attack')?.base_stat as number;
    const baseSpecialDefense: number = pokemon.stats.find(stats => stats.stat.name === 'special-defense')?.base_stat as number;
    const baseSpeed: number = pokemon.stats.find(stats => stats.stat.name === 'speed')?.base_stat as number;

    // 性格補正：
    // かなり複雑なためいったん無視
    const characterCorrection = 1;

    // 計算方法：
    // https://wiki.xn--rckteqa2e.com/wiki/%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9
    return {
      hp: Math.round((( baseHp + individualStats + effortStats / 4 ) * level / 100) + level + 10),
      attack: Math.round(((baseAttack / 2 + individualStats + effortStats / 4) * level / 100 + 5) * characterCorrection),
      defense: Math.round(((baseDefense / 2 + individualStats + effortStats / 4) * level / 100 + 5) * characterCorrection),
      specialAttack: Math.round(((baseSpecialAttack / 2 + individualStats + effortStats / 4) * level / 100 + 5) * characterCorrection),
      specialDefense: Math.round(((baseSpecialDefense / 2 + individualStats + effortStats / 4) * level / 100 + 5) * characterCorrection),
      speed: Math.round(((baseSpeed / 2 + individualStats + effortStats / 4) * level / 100 + 5) * characterCorrection)
    };
  }

  getIndividualStats() {
    // 計算方法：
    // https://wiki.xn--rckteqa2e.com/wiki/%E5%80%8B%E4%BD%93%E5%80%A4
    return this.getRandNum(0, 31);
  }

  getRandNum(min: number, max: number) {
    return Math.floor( Math.random() * ( max - min ) ) + min;
  }

  async getMoves(pokemon: IApiPokemon, level: number): Promise<IMove[]> {
    const moveIds: number[] = [];

    for (let i = 0; i < pokemon.moves.length; i++) {
      // レベル以上であれば処理終了
      const learnLevel = pokemon.moves[i].version_group_details.find(
        group => group.version_group.name === POKE_API_VERSION_KEY
      );
      if (learnLevel === undefined) continue;
      if (learnLevel.level_learned_at > level) {
        break;
      }

      const id = this.getUrlFromId(pokemon.moves[i].move.url);

      if (moveIds.length >= 4) {
        moveIds.unshift();
      }
      moveIds.push(id);
    }

    // const move: IMove = await this.pokeApi.getMove(id);
    const moves: IMove[] = await Promise.all(moveIds.map(async (id) => {
      const move: IApiMove = await this.pokeApi.getMove(id);
      return {
        id: move.id,
        name: this.getJaName(move.names),
        accuracy: move.accuracy,
        pp: move.pp,
        priority: move.priority,
        power: move.power,
        type: move.type.name
      }
    }));

    return moves;
  }

  getUrlFromId(url: string) : number {
    const match = url.match(/\d+/g) as RegExpMatchArray;
    return Number(match[1]);
  }
}