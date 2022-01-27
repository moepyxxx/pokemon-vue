<template>
  <div>
    <button @click="confirm">確認ボタン！</button>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import HandPokemons from "../../store/modules/handPokemons"
import IHandPokemon from '../../interface/IHandPokemon';
import IWildPokemon from '../../interface/IWildPokemon';

const handPokemonsModule = getModule(HandPokemons);
const pokemons = handPokemonsModule.pokemons;

type TData = {
  onHand: IHandPokemon,
  opponent: IWildPokemon
}

export default Vue.extend({
  name: 'StartPage',
  data(): TData {
    return {
      onHand: pokemons[0],
      opponent: null
    }
  },

  methods: {
    confirm() {
      console.log('味方', this.onHand);
      console.log('敵', this.opponent);
    }
  },

  async fetch() {
    const { id } = this.$nuxt.context.query;
    console.log(id);
    const level: number = Math.floor( Math.random() * ( 5 - 2 ) ) + 2;
    const wildPokemon: IWildPokemon = await this.$Poke.getWildPokemon(id, level);
    console.log(wildPokemon);
    this.opponent = wildPokemon;
  }
})

</script>