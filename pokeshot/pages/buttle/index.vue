<template>
  <div>
    <!-- <button @click="confirm">確認</button> -->


    <div v-if="this.serifs.length !== 0">
      <p> -------------------------------------- </p>

      <div class="serif">
        <p>{{ this.serifs[currentSerifIndex] }}</p>
      </div>

      <button
        v-if="buttleStatus !== 'isSelectBehave'"
        @click="nextSerif">次のセリフ
      </button>

      <p> -------------------------------------- </p>
    </div>

    <div v-if="this.buttleStatus === 'isSelectBehave'" class="command">
      <button @click="selectOnHandBehave(move)" v-for=" move in this.onHand.moves" :key="move.id">- {{ move.name }}</button>
    </div>

    <!-- ステータスのビュー -->
    <div class="buttlefield" style="display: flex">
      <div>
        <p><strong>敵</strong></p>
        <div>
          <p>{{ this.opponent.base.name }}（Lv. {{ this.opponent.level }}）</p>
          <img :src="this.opponent.base.imageUrl" alt="">
          <p>HP残り：{{ this.opponent.stats.hp }}</p>
        </div>
      </div>
      <div>
        <p><strong>味方</strong></p>
        <div>
          <p>{{ this.onHand.nickname }}（Lv. {{ this.onHand.level }}）</p>
          <img :src="this.onHand.base.imageUrl" alt="">
          <p>HP残り：{{ this.onHand.stats.hp }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import { getModule } from 'vuex-module-decorators'
import HandPokemons from "../../store/modules/handPokemons"
import HeroCurrent from '~/store/modules/heroCurrent';

import IHandPokemon from '../../interface/IHandPokemon';
import IWildPokemon, { IMove, IStats } from '../../interface/IWildPokemon';
import IOnButtle from '../../interface/IOnButtle';
import { TBehave, TButtlePokemon } from '../../plugins/buttleSys';
import _ from 'lodash'

const handPokemonsModule = getModule(HandPokemons);
const heroCurrentModule = getModule(HeroCurrent);

type TButtleStatus = 'buttleStart' | 'isSelectBehave' | 'behaveExecute' | 'buttleEnd' | 'buttleSave';

type TController = {
  runCount: number;
  actionCount: number;
}

@Component({
  async asyncData(ctx) {
    const { id } = ctx.query;
    const level: number = Math.floor( Math.random() * ( 5 - 2 ) ) + 2;
    const wildPokemon: IWildPokemon = await ctx.$Poke.getWildPokemon(Number(id), level);

    // バトル展開
    const opponent = ctx.$ButtleSys.prepareButtleRequired(wildPokemon);
    const pokemons = handPokemonsModule.pokemons;
    const onHand = ctx.$ButtleSys.prepareButtleRequired(_.cloneDeep(pokemons[0]));

    const serifs = [
      `あ！やせいの${opponent.base.name}があらわれた`,
      `いけ、${onHand.nickname}！`
    ]

    // [note]: 残りの手持ちポケモンをthis.otherPokemon格納
    // ポケモン入れ替えの際に活用するため

    return {
      opponent,
      onHand,
      serifs
    }
  },
})
export default class ButtlePage extends Vue {

  
  serifs: string[] = [];
  currentSerifIndex: number = 0;
  buttleStatus: TButtleStatus = 'buttleStart';

  // [note]:
  // asyncDataからのうまい渡し方がわからない。?をつけるとundefinedの可能性が高くなるため
  // いたるところにリターン処理をする必要があり面倒。

  // @ts-ignore
  onHand: IHandPokemon & IOnButtle;

  // @ts-ignore
  opponent: IWildPokemon & IOnButtle;
  otherOnHands: (IHandPokemon & IOnButtle)[] = [];

  // バトル結果を保持
  winner:  TButtlePokemon | null = null;

  // バトル中のふるまいをセット
  behaves: TBehave[] = [];

  // バトル中に換算される値を保持
  controller: TController = {
    runCount: 0,
    actionCount: 0
  }

  isSefifEnd() {
    return this.currentSerifIndex  >= this.serifs.length;
  }

  /**
   * 次のセリフを展開
   */
  nextSerif() {
      this.currentSerifIndex++;

      if (this.isSefifEnd() && this.buttleStatus === 'buttleStart') {
        this.changeButtleStatus('isSelectBehave');
      }

      if (this.isSefifEnd() && this.buttleStatus === 'buttleEnd') {
        this.changeButtleStatus('buttleSave');
      }

      if (this.isSefifEnd() && this.buttleStatus === 'behaveExecute') {

        // 勝者が決まったら処理を終了
        if (this.winner !== null) {
          this.changeButtleStatus('buttleEnd');
        } else {
          this.changeButtleStatus('isSelectBehave');
        }

      }
  }


  /**
   * [note]: ステート管理のためここで保存
   * バトルステータスを変更
   */
  changeButtleStatus(status: TButtleStatus) {
    this.buttleStatus = status;
  }

  /**
   * 自分のふるまいをセット
   */
  selectOnHandBehave(move: IMove) {
    const onHandBehave: TBehave = this.$ButtleSys.selectBehave(this.onHand, this.opponent, 'onHand', move);
    this.behaves.push(onHandBehave);

    this.changeButtleStatus('behaveExecute');
  }

  /**
   * お互いにふるまいをおこなう
   */
  excuteBehave() {

    const opponentBehave: TBehave = this.$ButtleSys.selectBehave(this.onHand, this.opponent, 'opponent', null);
    this.behaves.push(opponentBehave);

    this.behaves = this.$ButtleSys.checkPriority(this.behaves);

    // ダメージ計算・こうげき結果処理
    for (let i = 0; i < this.behaves.length; i++) {
      const { effect, messages } = this.$ButtleSys.attack(this.behaves[i]);
      this.serifs.push(...messages);
      
      const { behavor, target } : {
        behavor: IStats,
        target: IStats
      } = this.$ButtleSys.changeStats(effect, this.behaves[i].pokemon, this.behaves[i].target);

      if (this.behaves[i].buttlePokemon === 'onHand') {
        this.onHand.stats = {...behavor};
        this.opponent.stats = {...target};
      } else {
        this.onHand.stats = {...target};
        this.opponent.stats = {...behavor};
      }

      this.winner = this.$ButtleSys.checkButtlePokemonStats(this.onHand, this.opponent);

      // 勝者が決まったら処理を終了
      if (this.winner !== null) {
        break;
      }
    }

    // ふるまいをリセット
    this.behaves = [];
  }

  endButtle() {
    // [note]: あとあと経験値処理等を行う

    if (this.winner === 'opponent') {
      // ゲームオーバー処理
    } else {

      const exp = this.$ButtleSys.getExp(this.onHand.level, this.opponent.level, this.opponent.baseExperience);
      const { isLevelUp, level, currentExp } = this.$ButtleSys.saveExp(this.onHand.level, this.onHand.currentExp, exp);

      this.onHand = {
        ...this.onHand,
        level,
        currentExp
      };

      this.serifs.push(`${this.opponent.base.name}はたおれた`);
      this.serifs.push(`${this.onHand.nickname}は${exp}の経験値を手に入れた`);
      if (isLevelUp) {
        this.serifs.push(`${this.onHand.nickname}はLv.${level}に上がった！`);
      }

      if (isLevelUp) {
        this.serifs.push(`レベルあがった。${this.onHand.level}になった！`);
      } else {
        this.serifs.push(`レベルあがらん`);
      }

      // ストアへポケモンのステータスを格納し直して登録
      const buttleEndedPokemons: IHandPokemon[] = [];
      const savedPokemon: IHandPokemon = this.$ButtleSys.saveButtleStatusToOnHand(this.onHand);
      buttleEndedPokemons.push(savedPokemon);

      handPokemonsModule.updateOnHandPokemons(buttleEndedPokemons);
    }
  }

  @Watch('buttleStatus')
  private changeStatus(status: TButtleStatus, oldStatus: TButtleStatus) {   
    this.currentSerifIndex = 0;
    this.serifs = [];

    if (status === 'isSelectBehave') {
      this.serifs.push(`${this.onHand.nickname}はどうする？`);
    }

    if (status === 'behaveExecute') {
      this.excuteBehave();
    }

    if (status === 'buttleEnd') {
      this.endButtle();
    }
    
    if (status === 'buttleSave') {
      const { fieldId, position } = heroCurrentModule.heroCurrent;
      this.$router.push(`/fields/${fieldId}?position=${position}`);
    } 
  }
}

</script>

<style scoped>

.buttlefield {
  margin: 80px 0;
}
.command button {
  display: block;
}

</style>