<template>
  <div>
    <MenuFlame
      message="あなたの げんざいの ステータスです"
    >
      <div class="hero">

      </div>
    </MenuFlame>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MenuFlame from '@/component/games/MenuFlame.vue';

import { getModule } from 'vuex-module-decorators'
import HandPokemons from "@/store/modules/handPokemons"
import HeroCurrent from '@/store/modules/heroCurrent';
import Hero from '@/store/modules/hero';

@Component({
  components: {
    MenuFlame
  }
})
export default class MenusPokemonPage extends Vue {
  heroCurrent: HeroCurrent = getModule(HeroCurrent);
  hero: Hero = getModule(Hero);
  handPokemon: HandPokemons = getModule(HandPokemons);
}

</script>

<style scoped lang="scss">

</style>