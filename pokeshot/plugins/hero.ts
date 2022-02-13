import { Plugin } from "@nuxt/types";
import { Context, Inject } from "@nuxt/types/app";
import { getModule } from "vuex-module-decorators";
import HandPokemons from "~/store/modules/handPokemons";
import _ from 'lodash'

const handPokemonsModule: HandPokemons = getModule(HandPokemons);

const defineHero: Plugin = ( ctx: Context, inject: Inject ) => {
  inject('Hero', new Hero(handPokemonsModule));
}
export default defineHero

export class Hero {

  handPokemonsModule: HandPokemons;

  constructor(handPokemonsModule: HandPokemons) {
    this.handPokemonsModule = handPokemonsModule;
  }

  getRecoveryPokemon() {
    this.handPokemonsModule.updateOnHandPokemons(
      this.handPokemonsModule.pokemons.map(pokemon => {
        pokemon.remainHp = pokemon.stats.hp;
        return pokemon;
      })
    )
  }
}