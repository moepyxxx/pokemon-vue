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
      <button @click="controllDirection('above')">上</button>
      <button @click="controllDirection('left')">左</button>
      <button @click="controllDirection('right')">右</button>
      <button @click="controllDirection('below')">下</button>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import IPokemon from '../../config/types/pokemon';
import { douro101Objects, douro101Fields } from '../../datas/field/douro/101';
import { TDirection, TField, TFieldObject, TObjectAction } from '../../datas/field/types';

type TData = {
  currentPosition: number,
  allPositionLength: number,
  direction: TDirection,
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

    checkAction(currentPosition: number, nextPosition: number, reversedirection: TDirection): boolean {

      let direction: TDirection = 'right';
      switch (reversedirection) {
        case 'left':
          direction = 'right';
          break;
        case 'right':
          direction = 'left';
          break;
        case 'above': 
          direction = 'below';
          break;
        case 'below':
          direction = 'above';
          break;
      }

      if ( this.fieldObjects[nextPosition] === null || 
        this.fieldObjects[nextPosition].actions.length === 0 ) {
        return false;
      }

      const action: TObjectAction | false = this.fieldObjects[nextPosition].actions?.find(
        (action: TObjectAction) => action.direction === direction
      );

      if (!action) {
        return false;
      }

      if (action.execute === 'stop') {
        // 何もしない
        return true;
      }

      return false;
    },

    controllDirection(direction: TDirection) {

      if (this.direction !== direction) {
        this.changeDirection(direction);
        return;
      }

      let nextPosition: number = 0;
      switch (direction) {
        case 'above':
          nextPosition = this.getNextAbovePosition();
          break;
        case 'below':
          nextPosition = this.getNextBelowPosition();
          break;
        case 'left':
          nextPosition = this.getNextLeftPosition();
          break;
        case 'right':
          nextPosition = this.getNextRightPosition();
      }

      const action: boolean = this.checkAction(this.currentPosition, nextPosition, direction);

      if (action) return;

      this.currentPosition = nextPosition;
      this.checkAppearWildPokemon();
    },

    getNextLeftPosition(): number {
      return this.currentPosition - 1;
    },

    getNextRightPosition(): number {
      return this.currentPosition + 1;
    },

    getNextAbovePosition(): number {
      return this.currentPosition - this.position.row;
    },

    getNextBelowPosition(): number {
      return this.currentPosition + this.position.row;
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