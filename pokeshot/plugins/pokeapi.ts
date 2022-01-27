import { MAX_POKEMON_NO_RANGE, MIN_POKEMON_NO_RANGE } from "../config/pokemon";
import { POKE_API_MOVE_PATH, POKE_API_POKEMON_PATH, POKE_API_SPECIRS_PATH } from "../config/pokeapi";
import { isTPokemonType, TPokemonType } from "../types/pokemonType";
import IPokemon from "../config/types/pokemon";
import { Plugin } from "@nuxt/types";
import { Context, Inject } from "@nuxt/types/app";
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import IPokemonSpecies from "~/config/types/pokemonSpecies";
import IApiMove from "~/config/types/move";

const definePokeApi: Plugin = ( ctx: Context, inject: Inject ) => {
  inject('PokeApi', new PokeApi(ctx.$axios));
}
export default definePokeApi

export class PokeApi {

  axios: NuxtAxiosInstance;

  pokemonPath: string = POKE_API_POKEMON_PATH;

  pokemonSpeciesPath: string = POKE_API_SPECIRS_PATH;

  movePath: string = POKE_API_MOVE_PATH;

  constructor (axios: NuxtAxiosInstance) {
    this.axios = axios
  }

  /**
   * 一匹のポケモンを取得する
   * @param id number 指定IDのポケモンを取得する
   * @param type TPokemonType[] 指定タイプ群
   */
  async getPokemon<T extends number|TPokemonType[]>(args?: T): Promise<IPokemon|void> {

    if (!args) {
      return await this.getPokemonRandom();
    }

    if (typeof(args) === "number") {
      return await this.getPokemonFromId(args);
    }

    if (isTPokemonType(args)) {
      return await this.getPokemonFromTypes(args);
    }
  }

  async getPokemonRandom(count: number = 1): Promise<IPokemon|never> {

    // [note]: いずれ複数処理
    if (count !== 1) {
      new Error('その関数まだ作ってない！');
    }

    const randId: number = Math.floor( Math.random() * ( MAX_POKEMON_NO_RANGE - MIN_POKEMON_NO_RANGE ) ) + MIN_POKEMON_NO_RANGE;
    const pokemon: IPokemon = await this.axios.$get(this.pokemonPath + randId);

    return pokemon;
  }

  async getPokemonFromId(id: number): Promise<IPokemon|never> {
    if (id < MIN_POKEMON_NO_RANGE || id > MAX_POKEMON_NO_RANGE) {
      throw new Error('そのIDのポケモンは取得できません！（ホウエン地方じゃないと）');
    }
    const pokemon: IPokemon = await this.axios.$get(this.pokemonPath + id);
    return pokemon;
  }

  async getPokemonFromTypes(types: TPokemonType[]): Promise<IPokemon|never> {

    let isFind = false;
    let pokemon: null|IPokemon = null;
    do {
      pokemon = await this.getPokemonRandom();
      isFind = pokemon.types.some(type => {
        if (types.includes(type.type.name)) return true;
      });
    }
    while (!isFind);

    return pokemon;
  }

  async getPokemonSpeciesFromId(id: number): Promise<IPokemonSpecies|never> {
    const pokemonSpecies: IPokemonSpecies = await this.axios.$get(this.pokemonSpeciesPath + id);
    return pokemonSpecies;
  }

  async getMove(id: number): Promise<IApiMove|never> {
    const move: IApiMove = await this.axios.$get(this.movePath + id);
    return move;
  }
}