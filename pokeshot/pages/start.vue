<template>
  <div class="align-center">

    <p v-if="isFixFirstPokemon">
      おめでとう、あなたは{{ selectPokemon.base.name }}{{ nickname ? '（' + nickname + '）' : '' }}を手に入れたよ
      <NuxtLink to="/fields/aaaa">くさむらに行ってみよう</NuxtLink>
    </p>

    <div v-else>
      <p>どのポケモンを選びますか？</p>
      <br />
      <div v-for="pokemon in pokemons" :key="pokemon.id">
        <button @click="changeSelectPokemon(pokemon)">{{ pokemon.base.name }}</button>
      </div>
      <br />
      <p>ニックネーム</p>
      <input v-model="nickname" type="text" style="border: 1px solid #000"><br />
      <p>現在の入力：{{ nickname }}</p>
      <br />
      <p>現在選んでいるポケモン：{{ selectPokemon ? selectPokemon.base.name : '' }}</p>
      <br />
      <button @click="fixFirstPokemon">きみにきめた！</button>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import HandPokemons from "../store/modules/handPokemons"
import { pokemonSelectableInFirst } from "../datas/pokemonSelectableInFirst"
import { TGender } from '../types/gender';
import IWildPokemon from '../interface/IWildPokemon'
import IHandPokemon from '../interface/IHandPokemon'

const handPokemonsModule = getModule(HandPokemons);
const pokemons = handPokemonsModule.pokemons;

type TData = {
  pokemons: IHandPokemon[],
  nickname: string,
  selectPokemon: IWildPokemon | null,
  isFixFirstPokemon: boolean
}

export default Vue.extend({
  name: 'StartPage',
  data(): TData {
    return {
      pokemons,
      nickname: null,
      selectPokemon: null,
      isFixFirstPokemon: false
    }
  },

  computed: {
    changeSelectPokemon() {
      return (pokemon: IWildPokemon) => {
        this.selectPokemon = pokemon;
      }
    },
    checkGender(): TGender {
      return 'オス';
    },
  },

  methods: {
    fixFirstPokemon() {

      if (!this.selectPokemon) return;

      const onHandPokemon: IHandPokemon = this.$Poke.getHandPokemon(this.selectPokemon, this.nickname);
      handPokemonsModule.addToOnHandPokemon(onHandPokemon);
      this.isFixFirstPokemon = true;
    }
  },
  async asyncData(ctx) {

    const pokemons = await Promise.all(pokemonSelectableInFirst.map(async id => {
      const wildPokemon: IWildPokemon = await ctx.$Poke.getWildPokemon(id, 10);
      return { ...wildPokemon };
    }))

    return {
      pokemons
    }

  },
})

</script>
