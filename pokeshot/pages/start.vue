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
import { POKE_API_LANG_KEY, POKE_API_SPECIRS_PATH } from "../config/pokeapi"
import IPokemonSpecies, { TName } from "../config/types/pokemonSpecies"

const handPokemonsModule = getModule(HandPokemons);
const pokemons = handPokemonsModule.pokemons;
console.log(pokemons);

type TData = {
  pokemons: THandPokemon[],
  nickname: string,
  selectPokemon: { id: number, name: string } | null,
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
      return (pokemon) => {
        this.selectPokemon = pokemon;
      }
    },
    checkGender() {
      return 'オス';
    },
  },
  methods: {
    fixFirstPokemon() {
      const onHandPokemon: THandPokemon = {
        speciesId: this.selectPokemon.id,
        pokemon: this.selectPokemon.name,
        nickname: this.nickname,
        gender: this.checkGender
      }
      console.log(pokemons);
      handPokemonsModule.addToOnHandPokemon(onHandPokemon);
      console.log(pokemons);
      this.isFixFirstPokemon = true;
    }
  },
  async asyncData({ $axios }) {

    const names = await Promise.all(pokemonSelectableInFirst.map(async id => {
      const pokemon: IPokemonSpecies = await $axios.$get(POKE_API_SPECIRS_PATH + id);
      const nameObj: TName = pokemon.names.find( (nameobj: TName ) => {
        const isJaNameObj: boolean = nameobj.language.name === POKE_API_LANG_KEY;
        if (!isJaNameObj) return false;
        return nameobj;
      })
      return { id, nameObj };
    }))

    return {
      pokemons: names.map(name => {
        return {
          id: name.id,
          name: name.nameObj.name
        }
      })
    }

  },
})

</script>
