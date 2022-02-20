<template>
  <Screen>
    <div class="wrapper">
      <div class="wrapper-inner">
        <p>ゲームが終了されました。</p>
        <p>5秒後にスタート画面へリダイレクトします。</p>
      </div>
    </div>
  </Screen>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Screen from '@/component/games/Screen.vue'
import Serif from '@/component/games/Serif.vue'

import { getModule } from 'vuex-module-decorators'
import Game from '@/store/modules/game';

@Component({
  layout: 'index',
  name: 'EndPage',
  components: {
    Screen,
    Serif
  },
})
export default class EndPage extends Vue {

  gameModule: Game = getModule(Game);

  mounted() {
    this.gameModule.gameEnd();
    setTimeout(() => {
      this.$router.push('/')
    }, 5000);
  }

}

</script>

<style scoped lang="scss">

.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 32px 60px;
  background: #151C18;

  &-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    p {
      color: #fff;
    }
  }
}

</style>