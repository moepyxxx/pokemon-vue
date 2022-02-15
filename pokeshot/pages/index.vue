<template>
  <section>
    <Screen>
      <div class="title">
        <h1>ポケットモンスター</h1>
        <p>POCKET MONSTER</p>
      </div>
      <div class="image">
        <img src="~/assets/img/scenario/girl.png" alt="はるか">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png" alt="アチャモ">
      </div>
      <div class="command">
        <button @click="continuateStart">つづきから</button>
        <button @click="resetStart">さいしょから</button>
      </div>
    </Screen>
    
    <GreetingModal />
  </section>
</template>

<script lang="ts">
import Screen from '../component/games/Screen.vue';
import GreetingModal from '../component/settings/GreetingModal.vue';

import { Component, Vue } from 'vue-property-decorator';
import HandPokemons from '~/store/modules/handPokemons';
import { getModule } from 'vuex-module-decorators';
import Hero from '~/store/modules/hero';
import HeroCurrent from '~/store/modules/heroCurrent';
import Game from '~/store/modules/game';

@Component({
  name: 'IndexPage',
  layout: 'index',
  components: {
    Screen,
    GreetingModal
  },
})
export default class IndexPage extends Vue {

  gameModule: Game = getModule(Game);

  get isReportValid(): boolean {
    return this.$Hero.isReportValid();
  }

  resetStart() {
    this.$Hero.destroyReport();
    this.$router.push("/start");
  }

  continuateStart() {
    const { fieldId, position } = this.$Hero.restoreReport();
    this.gameModule.gameStart();
    this.$router.push(`/maps/${fieldId}?position=${position}`)
  }
}

</script>

<style scoped lang="scss">

.title {
  text-align: center;
  margin: 80px 0 40px;
  h1 {
    font-size: 3rem;
    margin-bottom: 30px;
    letter-spacing: .8rem;
  }
  p {
    letter-spacing: .8rem;
    font-size: 1.6rem;
  }
}


.image {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin: 0 -10px;
  }
}

.command button {
  display: block;
  margin: 16px auto;
  font-size: 16px;
}
</style>
