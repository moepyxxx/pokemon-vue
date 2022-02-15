import { Plugin } from "@nuxt/types";
import { Context, Inject } from "@nuxt/types/app";
import { getModule } from "vuex-module-decorators";
import HandPokemons from "~/store/modules/handPokemons";
import HeroStore from "~/store/modules/hero";
import _ from 'lodash'
import HeroCurrent from "~/store/modules/heroCurrent";

const handPokemonsModule: HandPokemons = getModule(HandPokemons);
const heroModule: HeroStore = getModule(HeroStore);
const heroCurrentModule: HeroCurrent = getModule(HeroCurrent);

const defineHero: Plugin = ( ctx: Context, inject: Inject ) => {
  inject('Hero', new Hero(
    handPokemonsModule,
    heroModule,
    heroCurrentModule
  ));
}
export default defineHero

export class Hero {

  handPokemonsModule: HandPokemons;
  heroModule: HeroStore;
  heroCurrentModule: HeroCurrent;

  constructor(
    handPokemonsModule: HandPokemons,
    heroModule: HeroStore,
    heroCurrentModule: HeroCurrent,
  ) {
    this.handPokemonsModule = handPokemonsModule;
    this.heroModule = heroModule;
    this.heroCurrentModule = heroCurrentModule;
  }

  getRecoveryPokemon() {
    this.handPokemonsModule.updateOnHandPokemons(
      this.handPokemonsModule.allPokemons.map(pokemon => {
        pokemon.remainHp = pokemon.stats.hp;
        return pokemon;
      })
    )
  }

  writeReport() {
    const pokemons = this.handPokemonsModule.allPokemons;
    const heroCurrent = this.heroCurrentModule.getHeroCurrent;
    const hero = this.heroModule.getHero;

    localStorage.setItem('pokemons', JSON.stringify(pokemons));
    localStorage.setItem('heroCurrent', JSON.stringify(heroCurrent));
    localStorage.setItem('hero', JSON.stringify(hero));
  }

  destroyReport() {
    localStorage.removeItem('pokemons');
    localStorage.removeItem('heroCurrent');
    localStorage.removeItem('hero');
  }

  isReportValid(): boolean {
    const restoredPokemons = localStorage.getItem('pokemons');
    const restoredHeroCurrent = localStorage.getItem('heroCurrent');
    const restoredHero = localStorage.getItem('hero');
    return restoredPokemons && restoredHeroCurrent && restoredHero ? true : false;
  }

  restoreReport(): {
    fieldId: string,
    position: string
  } {

    const restoredPokemons = localStorage.getItem('pokemons');
    const restoredHeroCurrent = localStorage.getItem('heroCurrent');
    const restoredHero = localStorage.getItem('hero');

    if (!restoredPokemons || !restoredHeroCurrent || !restoredHero) {
      this.destroyReport();
      throw new Error('データがこわれてしまいました。最初から始めます');
    }

    handPokemonsModule.updateOnHandPokemons(JSON.parse(restoredPokemons));
    heroModule.registerHero(JSON.parse(restoredHero));
    heroCurrentModule.updateCurrent(JSON.parse(restoredHeroCurrent));

    
    const { fieldId, position } = heroCurrentModule.heroCurrent;

    return {
      fieldId,
      position: position.toString()
    }
  }
}