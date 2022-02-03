<template>
  <div>
    <p>フィールドを歩いてみよう</p>

    <div class="field">
      
      <span v-for="(field, fieldIndex) in fields" :key="fieldIndex" :class="field.type">

        <div v-if="fieldIndex === currentPosition">
          <img class="hero" :src="require(`~/assets/img/hero/girl-${direction}.gif`)" />
        </div>

        <img
          class="grass"
          v-if="isFieldGrass(fieldIndex)"
          :src="require('@/assets/img/fieldobject/grass.svg')"
          alt="くさむら"
        >
        <img
          class="stonestep"
          v-if="isStoneStep(fieldIndex)"
          :src="require('@/assets/img/fieldobject/stonestep.svg')"
          alt="段差"
        >
        <img
          class="forestwall"
          v-if="isForestWall(fieldIndex)"
          :src="require('@/assets/img/fieldobject/forestwall.svg')"
          alt="木の壁"
        >
      </span>
    </div>
    <div class="controller">
      <button @click="controllAbove">上</button>
      <button @click="controllLeft">左</button>
      <button @click="controllRight">右</button>
      <button @click="controllBelow">下</button>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import IPokemon from '../../config/types/pokemon';
import { douro101Objects, douro101Fields } from '../../datas/field/douro/101';
import { TField, TFieldObject } from '../../datas/field/types';

type TDirection = 'above' | 'right' | 'left' | 'below';
type TData = {
  currentPosition: number,
  allPositionLength: number,
  direction: TDirection;
  position: {
    col: number,
    row: number
  }
  fields: TField[],
  fieldObjects: TFieldObject[]
}

export default Vue.extend({
  name: 'StartPage',
  data(): TData {
    return {
      currentPosition: 42,
      allPositionLength: 240,
      position: {
        col: 12,
        row: 20
      },
      direction: 'below',
      fields: douro101Fields ?? null,
      fieldObjects: douro101Objects ?? null
    }
  },
  methods: {
    isFieldGrass(fieldIndex: number): boolean {
      return this.fields[fieldIndex].type === 'grass';
    },

    isForestWall(fieldIndex: number): boolean {
      const object: TFieldObject | null = this.fieldObjects[fieldIndex];
      if (!object) return false;
      return object.objectType === 'forestwall' && object.startMark;
    },
    isStoneStep(fieldIndex: number): boolean {
      const object: TFieldObject | null = this.fieldObjects[fieldIndex];
      if (!object) return false;
      return object.objectType === 'stonestep';
    },

    changeDirection(direction: TDirection) {
      this.direction = direction;
    },

    controllAbove() {

      if (this.direction !== 'above') {
        this.changeDirection('above');
      } else {
        const nextPosition = this.currentPosition - this.position.row;
        if (nextPosition >= 0) {
          this.currentPosition = nextPosition;
          this.checkAppearWildPokemon();
        }
      }
    },

    controllBelow() {
      if (this.direction !== 'below') {
        this.changeDirection('below');
      } else {
        const nextPosition = this.currentPosition + this.position.row;
        if (nextPosition < this.allPositionLength) {
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
          .map((_, i) => i)
          .filter((number: number) => {
            if (number % this.position.row !== 0) return true;  
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
          .map((_, i) => i)
          .filter((number: number) => {
            if (number % this.position.row !== this.position.row - 1) return true;
          })
        ;
        if (mostRights.includes(this.currentPosition)) {
          this.currentPosition += 1;      
          this.checkAppearWildPokemon();
        }
      }
    },

    async checkAppearWildPokemon() {
      // [note]: damy
      return;
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
  width: 800px;
  /* border: 5px solid #000; */
  margin: 0 auto;
}

.field > span {
  display: block;
  width: calc(800px / 20);
  height: calc(800px / 20);
  text-align: center;
  position: relative;
}

.hero {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 15;
}

.grass {
  width: calc(800px / 20);
  height: calc(800px / 20);
}

.forestwall {
    width: calc(800px / 20 * 2);
  height: calc(800px / 20 * 2);
}

.grassplain, .grass {
  background-color: #BCDDB6;
}

.load {
  background-color: #F3E2A5;
}

.river {
  background-color: #8BD6DB;
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

img {
  z-index: 10;
  position: relative;
}

</style>