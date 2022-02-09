<template>
  <div>
    <Screen>
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

          <span class="black" :class="{'is-active': fieldsIsBlacks[fieldIndex]}"></span>

        </span>
      </div>
      
    </Screen>

    <div class="controller">
      <Controller
        @controllAbove="controllDirection('above')"
        @controllLeft="controllDirection('left')"
        @controllRight="controllDirection('right')"
        @controllBelow="controllDirection('below')"
      />
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Screen from '../../component/games/Screen.vue';
import Controller from '../../component/games/Controller.vue';

import loads, { TLoad } from '../../datas/field/loads/index';
import IPokemon from '../../config/types/pokemon';
import { TDirection, TField, TFieldObject, TObjectAction } from '../../datas/field/types';

@Component({
  components: {
    Screen,
    Controller
  },
  
  async asyncData(ctx) {
    const id: string = ctx.params.fieldId;
    const load: TLoad | null | undefined = loads.find(load => load.id === Number(id));

    if (!load) {
      throw new Error('そんな道路はありません！');
    }

    return {
      fields: load.fields,
      fieldObjects: load.objects
    }
  }
})

export default class FieldPage extends Vue {
  currentPosition: number = 42;
  allPositionLength: number = 240;
  fieldsIsBlacks: boolean[] = [...Array(this.allPositionLength)].map((_, i) => false);
  position: {
    col: number,
    row: number
  } = {
    col: 12,
    row: 20
  };
  direction: TDirection = 'below';

  private fields?: TField[];
  private fieldObjects?: TFieldObject[];
  
  isFieldGrass(fieldIndex: number): boolean|never {
    if (!this.fields) {
      throw new Error('フィールドがないよ');
    }
    return this.fields[fieldIndex].type === 'grass';
  }

  isForestWall(fieldIndex: number): boolean|never {
    if (!this.fieldObjects) {
      throw new Error('フィールドオブジェクトがないよ');
    }

    const object: TFieldObject | null = this.fieldObjects[fieldIndex];
    if (!object) return false;
    return object.objectType === 'forestwall' && object.startMark;
  }

  isStoneStep(fieldIndex: number): boolean {
    if (!this.fieldObjects) {
      throw new Error('フィールドオブジェクトがないよ');
    }
    const object: TFieldObject | null = this.fieldObjects[fieldIndex];
    if (!object) return false;
    return object.objectType === 'stonestep';
  }

  changeDirection(direction: TDirection) {
    this.direction = direction;
  }

  checkAction(currentPosition: number, nextPosition: number, reversedirection: TDirection): boolean|never {
    
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

    if (!this.fieldObjects) {
      throw new Error('フィールドオブジェクトがないよ');
    }

    if ( this.fieldObjects[nextPosition] === null || 
      this.fieldObjects[nextPosition].actions?.length === 0 ) {
      return false;
    }

    const action: TObjectAction | undefined = this.fieldObjects[nextPosition].actions?.find(
      (action: TObjectAction) => action.direction === direction
    );

    if (!action) {
      return false;
    }

    if (action.execute === 'stop') {
      // 何もしない
      return true;
    }

    if (action.execute === 'jumpdown') {
      this.jumpDown();
      return true;
    }

    return false;
  }

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
  }

  jumpDown() {
    this.currentPosition = this.currentPosition + (this.position.row * 2);
  }

  getNextLeftPosition(): number {
    return this.currentPosition - 1;
  }

  getNextRightPosition(): number {
    return this.currentPosition + 1;
  }

  getNextAbovePosition(): number {
    return this.currentPosition - this.position.row;
  }

  getNextBelowPosition(): number {
    return this.currentPosition + this.position.row;
  }

  async checkAppearWildPokemon() {

    if (!this.fields) return;

    if (this.fields[this.currentPosition].type !== 'grass') return;
    const rand = Math.random();
    const isAppear = rand < 0.3 ? true : false;
    if (!isAppear) return;

    await this.pokemonAppearAnimation();
    const pokemon: IPokemon = await this.$PokeApi.getPokemon(['normal', 'grass', 'poison', 'ground', 'bug']);
    this.$router.push(`/buttle?id=${pokemon.id}`)
  }

  shuffle([...array]) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async pokemonAppearAnimation() {
    const listNumes: number[] = [...Array(this.allPositionLength)].map((_, i) => i);
    const shuffled: number[] = this.shuffle(listNumes);
    for ( let index = 0; index < shuffled.length; index++ ) {
      await this.addAsyncAnimationClass(shuffled[index]);
    }
  }

  async addAsyncAnimationClass(index: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.$set(this.fieldsIsBlacks, index, true);
        resolve();
      }, 5);
    })
  }

}

</script>


<style scoped lang="scss">

.field {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  width: 800px;
  margin: 0 auto;
  position: relative;
  & > span {
    display: block;
    width: calc(800px / 20);
    height: calc(800px / 20);
    text-align: center;
    position: relative;
    & > p {
      margin-bottom: 0;
    }
  }

  .black {
    position: absolute;
    width: calc(800px / 20);
    height: calc(800px / 20);
    top: 0;
    left: 0;
    z-index: -5;
    display: none;

    &.is-active {
      z-index: 20;
      display: block;
    }
  }
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

img {
  z-index: 10;
  position: relative;
}

</style>