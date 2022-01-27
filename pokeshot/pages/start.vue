<template>
  <div class="align-center">

    <p v-if="isFixFirstPokemon">
      おめでとう、あなたは{{ selectPokemon.name }}（{{ nickname ? nickname : 'ニックネームなし' }}）を手に入れたよ
      <NuxtLink to="/field">くさむらに行ってみよう</NuxtLink>
    </p>

    <div v-else>
      <p>どのポケモンを選びますか？</p>
      <br />
      <div v-for="pokemon in pokemons" :key="pokemon.id">
        <button @click="changeSelectPokemon(pokemon)">{{ pokemon.name }}</button>
      </div>
      <br />
      <p>ニックネーム</p>
      <input v-model="nickname" type="text" style="border: 1px solid #000"><br />
      <p>現在の入力：{{ nickname }}</p>
      <br />
      <p>現在選んでいるポケモン：{{ selectPokemon ? selectPokemon.name : '' }}</p>
      <br />
      <button @click="fixFirstPokemon">きみにきめた！</button>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import HandPokemons, { THandPokemon } from "../store/modules/handPokemons"
import { pokemonSelectableInFirst } from "../datas/pokemonSelectableInFirst"
import IPokemonSpecies from "../config/types/pokemonSpecies"
import { TGender } from '../types/gender';

const handPokemonsModule = getModule(HandPokemons);
const pokemons = handPokemonsModule.pokemons;

type TSelectPokemon = { id: number, name: string };
type TData = {
  pokemons: THandPokemon[],
  nickname: string,
  selectPokemon: TSelectPokemon | null,
  isFixFirstPokemon: boolean
}

export default Vue.extend({
  name: 'StartPage',
  data(): TData {
    return {
      pokemons,
      nickname: '',
      selectPokemon: null,
      isFixFirstPokemon: false
    }
  },
  computed: {
    changeSelectPokemon() {
      return (pokemon: TSelectPokemon) => {
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

      const onHandPokemon: THandPokemon = {
        speciesId: this.selectPokemon.id,
        pokemon: this.selectPokemon.name,
        nickname: this.nickname,
        gender: this.checkGender
      }
      handPokemonsModule.addToOnHandPokemon(onHandPokemon);
      this.isFixFirstPokemon = true;
    }
  },
  async asyncData(ctx) {

    const pokemons = await Promise.all(pokemonSelectableInFirst.map(async id => {
      const pokemon: IPokemonSpecies = await ctx.$PokeApi.getPokemonSpeciesFromId(id);
      const name: string = ctx.$Poke.getJaName(pokemon.names);
      return { id, name };
    }))

    return {
      pokemons
    }

  },
})

</script>
