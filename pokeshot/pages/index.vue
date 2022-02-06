<template>
  <section class="field">
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
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
  methods: {
    start() {
      this.$router.push("/start")
    }
  }
})

</script>

<style scoped>

.field {
  width: 800px;
  min-height: 480px;
  margin: 40px auto;
  position: relative;
  border: 2px solid #000;
  border-radius: 4px;
}

.title {
  text-align: center;
  margin: 80px 0 40px;
}

.title h1 {
  font-size: 3rem;
  margin-bottom: 30px;
  letter-spacing: .8rem;
}

.title p {
  letter-spacing: .8rem;
  font-size: 1.6rem;
}

.image {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image img {
  margin: 0 -10px;
}

.command button {
  display: block;
  margin: 16px auto;
  font-size: 16px;
}

</style>
