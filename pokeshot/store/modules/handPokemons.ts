import {VuexModule, Module, Mutation, Action, getModule} from 'vuex-module-decorators' 
import store from "@/store/store"
import IHandPokemon from '~/interface/IHandPokemon';

@Module({ stateFactory: true, dynamic: true, store, name: "handPokemons" })
export default class HandPokemons extends VuexModule {
  pokemons: IHandPokemon[] = [];

  get firstOnHandPokemon() {
    return this.pokemons[0];
  }

  get otherOnHandPokemons() : IHandPokemon[] {
    return this.pokemons.filter((_, index) => index !== 0);
  }

  get pokemonLength() {
    return this.pokemons.length;
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