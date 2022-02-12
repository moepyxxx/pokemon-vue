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
            :src="require('@/assets/img/fieldobject/load/grass.svg')"
            alt="くさむら"
          >

          <img
            v-for="(fieldObjectType, index) in matchFieldObjectTypes(fieldIndex)"
            :key="index"
            :src="require(
              `@/assets/img/fieldobject/${fieldObjectType.directory}/${fieldObjectType.key}.svg`
            )"
            :alt="fieldObjectType.alt"
          />

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

import { getModule } from 'vuex-module-decorators';
import HeroCurrent from '~/store/modules/heroCurrent';

import loads, { TMap } from '../../datas/map/index';
import IPokemon from '../../config/types/pokemon';
import { TDirection, TField, TFieldObject, TObjectAction, TObjectType } from '../../datas/map/types';

const heroCurrentModule = getModule(HeroCurrent);

type TImgDirectory = 'building' | 'interior' | 'load' | 'pokemoncenter';

@Component({
  name: 'MapPage',

  components: {
    Screen,
    Controller
  },
  
  async asyncData(ctx) {
    const id: string = ctx.params.mapId;
    const currentPosition: number = Number(ctx.query.position);
    const load: TMap | null | undefined = loads.find(load => load.id === id);

    if (!load) {
      throw new Error('そんな道路はありません！');
    }

    return {
      currentPosition,
      fields: load.fields,
      fieldObjects: load.objects
    }
  }
})

export default class MapPage extends Vue {
  currentPosition: number = 200;
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

  fieldObjectTypes: { key: TObjectType, directory: TImgDirectory, alt: string }[] = [{
    key: 'privatehouse',
    directory: 'building',
    alt:  '民家',
  }, {
    key: 'pokemoncenter',
    directory: 'building',
    alt: 'ポケモンセンター'
  }, {
    key: 'table',
    directory: 'interior',
    alt: 'テーブル',
  }, {
    key: 'yellowchair',
    directory: 'interior',
    alt: '黄色い椅子'
  }, {
    key: 'pinkchair',
    directory: 'interior',
    alt: 'ピンクの椅子'
  }, {
    key: 'grass',
    directory: 'load',
    alt: '草むら'
  }, {
    key: 'stonestep',
    directory: 'load',
    alt: '段差',
  }, {
    key: 'forestwall',
    directory: 'load',
    alt: '木の壁',
  }, {
    key: 'bookshelf',
    directory: 'interior',
    alt: '本棚'
  }, {
    key: 'plant',
    directory: 'interior',
    alt: '植木鉢',
  }, {
    key: 'computer',
    directory: 'pokemoncenter',
    alt: 'パソコン'
  }, {
    key: 'recoverysystem',
    directory: 'pokemoncenter',
    alt: 'ポケモン回復システム'
  }];

  private fields?: TField[];
  private fieldObjects?: TFieldObject[];
  
  isFieldGrass(fieldIndex: number): boolean|never {
    if (!this.fields) {
      throw new Error('フィールドがないよ');
    }
    return this.fields[fieldIndex].type === 'grass';
  }

  matchFieldObjectTypes(index: number) {
    if (!this.fieldObjects) {
      throw new Error('フィールドオブジェクトがないよ');
    }
    
    const object: TFieldObject | null = this.fieldObjects[index];
    if (!object) return false;

    return this.fieldObjectTypes.filter(fieldObjectType => 
      fieldObjectType.key === object.objectType && object.startMark);
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

    // 現在地をストアへ保存
    heroCurrentModule.updateCurrent({
      ...heroCurrentModule.heroCurrent,
      position: this.currentPosition
    });

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

.forestwall, .table {
  width: calc(800px / 20 * 2);
  height: calc(800px / 20 * 2);
}

.pokemoncenter, .privatehouse {
  width: calc(800px / 20 * 3);
  height: calc(800px / 20 * 3);
}

.pinkchair, .yellowchair, .plant {
  width: calc(calc(800px / 20) - 10);
  height: calc(calc(800px / 20) -10);
  top: 10px;
  left: 0;
}

.bookshelf {
  width: calc(800px / 20 * 2);
  height: calc(800px / 20);
}

.recoverysystem {
  width: calc(800px / 20 * 6);
  height: calc(800px / 20 * 2);
}

.grassplain, .grass {
  background-color: #BCDDB6;
}

.nofield {
  background-color: black;
}

.load {
  background-color: #F3E2A5;
}

.floora {
  background-color: #F2F2E6;
}

.floorb {
  background-color: #F9F3D3;
}

.carpet {
  background-color: #D75058;
}

.river {
  background-color: #8BD6DB;
}

img {
  z-index: 10;
  position: relative;
}

</style>