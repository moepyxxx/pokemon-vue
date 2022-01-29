import {VuexModule, Module, Mutation, Action, getModule} from 'vuex-module-decorators' 
import store from "@/store/store"
import IHandPokemon from '~/interface/IHandPokemon';

@Module({ dynamic: true, store, name: "handPokemons" })
export default class HandPokemons extends VuexModule {
  pokemons: IHandPokemon[] = [];

  get firstOnHandPokemon() {
    return this.pokemons[0];
  }

  @Mutation
  public addToOnHandPokemon(pokemon: IHandPokemon) {
    if (this.pokemons.length >= 6) return;
    this.pokemons.push(pokemon);
  }

  @Mutation
  public updateOnHandPokemons(pokemons: IHandPokemon[]) {
    this.pokemons = pokemons;
  }

}