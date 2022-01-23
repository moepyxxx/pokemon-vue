<template>
  <div>
    <p>フィールドを歩いてみよう</p>
    <div class="field">
      <span v-for="i in allPositionLength" :key="i">
        <p>field:{{ i }}</p>
        <p v-if="currentPosition === i">いまここ</p>
      </span>
    </div>
    <div class="controller">
      <button @click="goTop">上</button>
      <button @click="goLeft">左</button>
      <button @click="goRight">右</button>
      <button @click="goBottom">下</button>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'


type TData = {
  currentPosition: number,
  allPositionLength: number
}

export default Vue.extend({
  name: 'StartPage',
  data(): TData {
    return {
      currentPosition: 13,
      allPositionLength: 25
    }
  },
  methods: {
    goTop() {
      const nextPosition = this.currentPosition - 5;
      if (nextPosition >= 1) {
        this.currentPosition = nextPosition;
      }
    },
    goBottom() {
      const nextPosition = this.currentPosition + 5;
      if (nextPosition <= 25) {
        this.currentPosition = nextPosition;
      }
    },
    goLeft() {
      const mostLefts: number[] = Array.from(new Array(this.allPositionLength))
        .map((_, i) => i + 1)
        .filter((number: number) => {
          if (number % 5 !== 1) return number;  
        })
      ;
      if (mostLefts.includes(this.currentPosition)) {
        this.currentPosition -= 1;
      }
    },
    goRight() {
      const mostRights: number[] = Array.from(new Array(this.allPositionLength))
        .map((_, i) => i + 1)
        .filter((number: number) => {
          if (number % 5 !== 0) return number;
        })
      ;
      if (mostRights.includes(this.currentPosition)) {
        this.currentPosition += 1;      
      }
    }
  }
})

</script>


<style scoped>

.field {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  width: 700px;
}

.field > span {
  display: block;
  width: calc( 90% / 5 );
  padding: 30px 15px;
  text-align: center;
}

.field > span:nth-child(odd) {
  background-color: #eee;
}

.field > span > p {
  margin-bottom: 0;
}

.controller {
  margin-top: 20px;
  text-align: center;
  width: 700px;
}
.controller button {
  width: 40px;
  height: 40px;
  background: chocolate;
  border-radius: 50%;
  margin: 0 20px;
  font-weight: bold;
  color: #fff;
}

</style>