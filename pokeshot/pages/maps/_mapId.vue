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
            v-if="fields[fieldIndex].type === 'grass'"
            :src="require('@/assets/img/fieldobject/load/grass.svg')"
            alt="くさむら"
          >

          <img
            v-for="(fieldObjectType, index) in filterFieldObject(fieldIndex)"
            :key="index"
            :class="fieldObjectType.key"
            :src="require(
              `@/assets/img/fieldobject/${fieldObjectType.directory}/${fieldObjectType.key}.svg`
            )"
            :alt="fieldObjectType.alt"
          />

          <img
            v-for="(fieldObject, index) in filterHumanObject(fieldIndex)"
            :key="index"
            :src="require(`@/assets/img/fieldobject/human/${fieldObject.human.imagename}/${fieldObject.direction}.png`)"
            :alt="fieldObject.human.name"
          />

          <span class="black" :class="{'is-active': fieldsIsBlacks[fieldIndex]}"></span>

        </span>
      </div>

      <Menu
        :isMenuActive="isMenuActive"
        @openMenu="openMenuAction"
        @openReport="reportAction"
      />

      <Serif
        :serifs="serifs"
        @next="next"
        :questions="questions"
      />

    </Screen>

    <div class="controller" v-if="!isPokemonAppear">
      <Controller
        @controllAbove="controllDirection('above')"
        @controllLeft="controllDirection('left')"
        @controllRight="controllDirection('right')"
        @controllBelow="controllDirection('below')"
        @controllAPush="controllAPush"
        @controllStart="isMenuActive = !isMenuActive"
      />
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Screen from '../../component/games/Screen.vue';
import Controller from '../../component/games/Controller.vue';
import Serif from '../../component/games/Serif.vue';
import Menu from '../../component/games/Menu.vue';

import { getModule } from 'vuex-module-decorators';
import HeroCurrent from '~/store/modules/heroCurrent';

import maps, { TMap } from '../../datas/map/index';
import IPokemon from '../../config/types/pokemon';
import { TDirection, TField, TFieldObject, TObjectAction, TObjectType } from '../../datas/map/types';
import { THuman, THumanAction } from '@/datas/human/types';
import humans from '@/datas/human/index';
import { TPosition } from '@/types/position';

const heroCurrentModule = getModule(HeroCurrent);

@Component({
  name: 'MapPage',

  components: {
    Screen,
    Controller,
    Serif,
    Menu
  },
  
  async asyncData(ctx) {
    const id: string = ctx.params.mapId;
    const currentPosition: number = Number(ctx.query.position);
    const load: TMap | null | undefined = maps.find(map => map.id === id);

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

  // メニュ系開閉について
  isMenuActive: boolean = false;
  isReportActive: boolean = false;

  currentPosition: number = 200;
  allPositionLength: number = 240;
  fieldsIsBlacks: boolean[] = [...Array(this.allPositionLength)].map((_, i) => false);
  position: TPosition = {
    col: 12,
    row: 20
  };
  direction: TDirection = heroCurrentModule.heroCurrent.direction;

  isPokemonAppear: boolean = false;

  serifs: string[] = [];
  next: () => void = this.empty;
  questions: {
    select: string;
    execute: (...args: any) => void;
  }[] = [];

  private fields: TField[] = [];
  private fieldObjects: TFieldObject[] = [];

  /**
   * Aボタンを押した時の挙動
   */
  controllAPush(): void {
    const nextPosition: number = this.$MapController.getNextPosition(this.currentPosition, this.direction, this.position);

    // アクションのチェック
    const actionChecked: false | TObjectAction[] = this.$MapController.checkAction('push-a', this.fieldObjects, nextPosition, this.direction);
    this.aPushAction(actionChecked);
  }

  /**
   * ↑↓→←ボタンを押した時の挙動
   */
  async controllDirection(direction: TDirection) {

    if (this.direction !== direction) {
      this.changeDirection(direction);
      return;
    }

    const nextPosition: number = this.$MapController.getNextPosition(this.currentPosition, this.direction, this.position);

    // ほかフィールドへの遷移チェック
    const goOtherFieldChecked = this.$MapController.checkGoOtherField(this.fieldObjects, nextPosition, this.direction);
    if (goOtherFieldChecked) {
      this.goOtherFieldAction(goOtherFieldChecked);
    }

    // アクションのチェック
    const actionChecked: false | TObjectAction[] = this.$MapController.checkAction('move', this.fieldObjects, nextPosition, direction);
    
    this.moveAction(actionChecked, nextPosition);

    // ポケモンの出現チェック
    const isPokemonAppear = await this.$MapController.checkAppearWildPokemon(this.fields, this.currentPosition);
    if (isPokemonAppear) {
      this.isPokemonAppear = true;
      await this.pokemonAppearAction();
    }
  }

  empty() {
    // [note]: 良いやり方模索したい
    // next back の関数にとりあえず
    // デフォルトを入れないとならないため
  }

  jumpDown() {
    this.currentPosition = this.currentPosition + (this.position.row * 2);
  }

  /**
   * フィールドの人表示のため
   * computed
   */
  filterHumanObject(index: number): {
    human: THuman,
    direction: TDirection  
  }[] {
    const object: TFieldObject | null = this.fieldObjects[index];
    if (!object) return [];

    const isHumanObject = (object.objectType === 'human') && object.startMark;
    if (!isHumanObject) return [];

    const id = object.objectDetail?.humanId;
    const direction = object.objectDetail?.direction;

    if (!id || !direction) return [];

    const human = humans.find(
      human => human.id === id);

    return human ? [{
      direction,
      human,
    }] : [];
  }

  /**
   * フィールドのオブジェクト表示のため
   * computed
   */
  filterFieldObject(index: number) {
    const object: TFieldObject | null = this.fieldObjects[index];
    if (!object) return false;

    return this.$MapController.fieldObjectTypes.filter(fieldObjectType => 
      fieldObjectType.key === object.objectType && object.startMark);
  }

  /**
   * 主人公の向きを変更
   */
  changeDirection(direction: TDirection) {
    this.direction = direction;
  }

  moveAction(actions: TObjectAction[] | false, nextPosition: number): void {

    const isNextPositionValid = this.$MapController.isNextPositionvalid(nextPosition, this.allPositionLength);
    if (!isNextPositionValid) return;
    
    if (!actions) {
      this.currentPosition = nextPosition;
      return;
    }

    for (let i = 0; i < actions.length ;i++) {
      switch (actions[i].execute) {
        case 'jumpdown':
          this.jumpDown();
          break;
        case 'stop':
          // 何もしない
          break;
      }
    }
  }

  aPushAction(actions: TObjectAction[] | false) {
    if (!actions) return;

    for (let i = 0; i < actions.length; i++) {
      if (actions[i].execute === 'talk' && actions[i].talk) {
        // [note]: どうしてもObject is possibly 'undefined' が倒せない !で対応
        this.humanAction(actions[i].talk!.humanId, actions[i].talk!.actionId);
      }
    }
  }

  resetHumanAction() {
    this.serifs = [];
    this.questions = [];
  }

  humanAction(humanId: string, actionId: string): void {
    this.resetHumanAction();

    const human: THuman = humans.find(_human => _human.id === humanId) as THuman;
    const action: THumanAction = human.actions.find(action => action.actionId === actionId) as THumanAction;

    switch (action.execute) {
      case 'recoverPokemon':
        this.recoverPokemonAction(human, action);
      case 'question':
        this.questionAction(human, action);
      case 'talk':
        this.$MapController.humanChangeDirection(this.fieldObjects, this.currentPosition, this.direction, this.position);
        this.talkAction(human, action);
    }

  }

  goOtherFieldAction(goOtherField: {
    id: string,
    position: number,
    direction: TDirection
  }) : void {
    const { id, position, direction } = goOtherField;

    // 現在地をストアへ保存
    heroCurrentModule.updateCurrent({
      position,
      fieldId: id,
      direction
    });

    this.$router.push(`${id}?position=${position}`);
  }

  questionAction(human: THuman, action: THumanAction) {
    if (!action.questions || !action.talk) return;

    for (let i = 0; i < action.talk.length; i++) {
      this.serifs.push(action.talk[i]);
    }

    this.next = this.empty;
    this.questions = action.questions.map(question => {
      return {
        select: question.select,
        execute: this.humanAction.bind(this, human.id, question.nextActionId as string)
      }
    })
  }

  talkAction(human: THuman, action: THumanAction) {

    if (!action.talk) return;

    for (let i = 0; i < action.talk.length; i++) {
      this.serifs.push(action.talk[i]);
    }
    
    this.next = () => {
      this.serifs.splice(0);
      if (action.nextActionId) {
        this.humanAction(human.id, action.nextActionId);
      }
    }
  }

  openMenuAction(linkPath: string): void {
    heroCurrentModule.updateCurrent({
      ...heroCurrentModule.getHeroCurrent,
      position: this.currentPosition,
      direction: this.direction,
      fieldId: this.$route.params.mapId
    })
    this.$router.push(linkPath);
  }

  reportAction() {
    // レポート処理
  }

  recoverPokemonAction(human: THuman, action: THumanAction) {
    this.$Hero.getRecoveryPokemon();

    if (action.nextActionId) {
      this.humanAction(human.id, action.nextActionId);
    }
  }

  async pokemonAppearAction() {
    // 現在地をストアへ保存
    heroCurrentModule.updateCurrent({
      ...heroCurrentModule.heroCurrent,
      position: this.currentPosition,
      direction: this.direction
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