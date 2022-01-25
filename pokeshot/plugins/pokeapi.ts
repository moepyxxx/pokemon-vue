import { MAX_POKEMON_NO_RANGE, MIN_POKEMON_NO_RANGE } from "../config/pokemon";
import { POKE_API_POKEMON_PATH } from "../config/pokeapi";
import { isTPokemonType, TPokemonType } from "../types/pokemonType";
import IPokemon from "../config/types/pokemon";
import { Plugin } from "@nuxt/types";
import { Context, Inject } from "@nuxt/types/app";
import { NuxtAxiosInstance } from '@nuxtjs/axios'

const Poke: Plugin = ( ctx: Context, inject: Inject ) => {
  inject('PokeApi', new PokeApi(ctx.$axios));
}
export default Poke

class PokeApi {

  axios: NuxtAxiosInstance;

  pokemonPath: string = POKE_API_POKEMON_PATH;

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

    const randId = MIN_POKEMON_NO_RANGE + Math.floor( Math.random() * (MAX_POKEMON_NO_RANGE + 1) );
    const pokemon: IPokemon = await this.axios.$get(this.pokemonPath + randId);

    return pokemon;
  }

  async getPokemonFromId(id: number): Promise<IPokemon|never> {
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
}