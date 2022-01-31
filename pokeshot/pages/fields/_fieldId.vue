<template>
  <div>
    <p>フィールドを歩いてみよう</p>
      {{ fields.length }}
            <img class="grass" src="/assets/img/fieldobject/stonestep.svg" alt="くさむら">

    <div class="field">
      
      <span v-for="(field, fieldIndex) in fields" :key="fieldIndex" :class="field.type">

        <div v-if="fieldIndex === currentPosition">
          <img :src="require(`~/assets/img/hero/girl-${direction}.gif`)" />
        </div>

        <img
          class="grass"
          v-if="isFieldGrass(fieldIndex)"
          :src="require('@/assets/img/fieldobject/grass.svg')"
          alt="くさむら"
        >
        <img
          class="grass"
          v-if="isFieldStoneStep(fieldIndex)"
          :src="require('@/assets/img/fieldobject/stonestep.svg')"
          alt="くさむら"
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
      currentPosition: 13,
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
      const grassFieldObj: TFieldObject|false = this.fieldObjects.find((obj: TFieldObject) => {
        return obj.objectType === 'grass';
      })

      if (!grassFieldObj) return false;
      if (grassFieldObj.cordinateIndex.includes(fieldIndex)) {
        return true;
      }
      return false;
    },
    isFieldStoneStep(fieldIndex: number): boolean {
      const grassFieldObj: TFieldObject|false = this.fieldObjects.find((obj: TFieldObject) => {
        return obj.objectType === 'stonestep';
      })

      if (!grassFieldObj) return false;
      if (grassFieldObj.cordinateIndex.includes(fieldIndex)) {
        return true;
      }
      return false;
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
}

.grass {
  width: calc(800px / 20);
  height: calc(800px / 20);
}

.grassplain {
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

</style>