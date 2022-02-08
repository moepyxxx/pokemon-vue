<template>
  <section>
    <Screen>
      <div class="title">
        <h1>ポケットモンスター</h1>
        <p>POCKET MONSTER</p>
      </div>
      <div class="image">
        <img src="~/assets/img/hero/girl.png" alt="はるか">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png" alt="アチャモ">
      </div>
      <div class="command">
        <button @click="start">つづきから</button>
        <button @click="start">さいしょから</button>
      </div>
    </Screen>
  </section>
</template>

<script lang="ts">
import Screen from '../component/games/Screen.vue';

import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Screen
  },
})
export default class IndexPage extends Vue {
  start() {
    this.$router.push("/start")
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
