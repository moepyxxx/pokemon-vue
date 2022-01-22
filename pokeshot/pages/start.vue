<template>
  <div class="align-center">
    <p>ポケモンをえらんだよ！ {{ pokemons[0].nickname }}</p>
    <br />
    <br />
    <ul id="example-1">
      <li v-for="(value, key) in pokemons[0]" :key="key">
        {{ key }} is {{ value }}
      </li>
    </ul>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import HandPokemons from "../store/modules/handPokemons"

const postsModule = getModule(HandPokemons);
const pokemons = postsModule.pokemons;

export default Vue.extend({
  name: 'StartPage',
  data() {
    return {
      pokemons
    }
  }
})

</script>
