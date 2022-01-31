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
      <button @click="controllTop">上</button>
      <button @click="controllLeft">左</button>
      <button @click="controllRight">右</button>
      <button @click="controllBottom">下</button>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import IPokemon from '../../config/types/pokemon';

type TDirection = 'top' | 'right' | 'left' | 'bottom';
type TData = {
  currentPosition: number,
  allPositionLength: number,
  direction: TDirection;
}

export default Vue.extend({
  name: 'StartPage',
  data(): TData {
    return {
      currentPosition: 13,
      allPositionLength: 25,
      direction: 'bottom'
    }
  },
  methods: {
    changeDirection(direction: TDirection) {
      this.direction = direction;
    },
    controllTop() {

      if (this.direction !== 'top') {
        this.changeDirection('top');
      } else {
        const nextPosition = this.currentPosition - 5;
        if (nextPosition >= 1) {
          this.currentPosition = nextPosition;
          this.checkAppearWildPokemon();
        }
      }
    },
    controllBottom() {

      if (this.direction !== 'bottom') {
        this.changeDirection('bottom');
      } else {
        const nextPosition = this.currentPosition + 5;
        if (nextPosition <= 25) {
          this.currentPosition = nextPosition;
          this.checkAppearWildPokemon();
        }
      }
    },
    controllLeft() {
      if (this.direction !== 'left') {
        this.changeDirection('left');

      } else {
        const mostLefts: number[] = Array.from(new Array(this.allPositionLength))
          .map((_, i) => i + 1)
          .filter((number: number) => {
            if (number % 5 !== 1) return number;  
          })
        ;
        if (mostLefts.includes(this.currentPosition)) {
          this.currentPosition -= 1;
          this.checkAppearWildPokemon();
        }
      }
    },
    controllRight() {
      if (this.direction !== 'right') {
        this.changeDirection('right');
      } else {
        const mostRights: number[] = Array.from(new Array(this.allPositionLength))
          .map((_, i) => i + 1)
          .filter((number: number) => {
            if (number % 5 !== 0) return number;
          })
        ;
        if (mostRights.includes(this.currentPosition)) {
          this.currentPosition += 1;      
          this.checkAppearWildPokemon();
        }
      }
    },
    async checkAppearWildPokemon() {
      const rand = Math.random();
      const isAppear = rand < 0.3 ? true : false;
      if (!isAppear) return;

      const pokemon: IPokemon = await this.$PokeApi.getPokemon(['normal', 'grass', 'poison', 'ground', 'bug']);
      this.$router.push(`/buttle?id=${pokemon.id}`)
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