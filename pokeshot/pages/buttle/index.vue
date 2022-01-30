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
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import HandPokemons from "../../store/modules/handPokemons"
import IHandPokemon from '../../interface/IHandPokemon';
import IWildPokemon, { IMove, IStats } from '../../interface/IWildPokemon';
import IOnButtle from '../../interface/IOnButtle';
import { TBehave, TButtlePokemon, TEffect } from '../../plugins/buttleSys';

const handPokemonsModule = getModule(HandPokemons);

type TButtleStatus = 'buttleStart' | 'isSelectBehave' | 'behaveExecute' | 'buttleEnd' | 'buttleSave';

type TController = {
  runCount: number;
  actionCount: number;
}

type TData = {
  serifs: string[],
  currentSerifIndex: number,
  buttleStatus: TButtleStatus,

  // 敵味方の保持
  onHand: IHandPokemon & IOnButtle,
  opponent: IWildPokemon & IOnButtle,
  otherOnHands: (IHandPokemon & IOnButtle)[],

  // バトル結果を保持
  winner: TButtlePokemon | null,

  // バトル中に換算される値を保持
  controller: TController

  // バトル中のふるまいをセット
  behaves: TBehave[];
}


export default Vue.extend({
  name: 'StartPage',
  data(): TData {
    return {
      serifs: [],
      currentSerifIndex: 0,
      buttleStatus: 'buttleStart',
      onHand: null,
      opponent: null,
      otherOnHands: [],
      winner: null,
      behaves: [],
      controller: {
        runCount: 0,
        actionCount: 0
      }
    }
  },

  computed: {
    isSefifEnd() {
      return this.currentSerifIndex  >= this.serifs.length;
    },
  },

  methods: {

    /**
     * 次のセリフを展開
     */
    nextSerif() {
        this.currentSerifIndex++;

        if (this.isSefifEnd && this.buttleStatus === 'buttleStart') {
          this.changeButtleStatus('isSelectBehave');
        }

        if (this.isSefifEnd && this.buttleStatus === 'buttleEnd') {
          this.changeButtleStatus('buttleSave');
        }

        if (this.isSefifEnd && this.buttleStatus === 'behaveExecute') {

          // 勝者が決まったら処理を終了
          if (this.winner !== null) {
            this.changeButtleStatus('buttleEnd');
          } else {
            this.changeButtleStatus('isSelectBehave');
          }

        }
    },


    /**
     * [note]: ステート管理のためここで保存
     * バトルステータスを変更
     */
    changeButtleStatus(status: TButtleStatus) {
      this.buttleStatus = status;
    },

    /**
     * 自分のふるまいをセット
     */
    selectOnHandBehave(move: IMove) {
      const onHandBehave: TBehave = this.$ButtleSys.selectBehave(this.onHand, this.opponent, 'onHand', move);
      this.behaves.push(onHandBehave);

      this.changeButtleStatus('behaveExecute');
    },

    /**
     * お互いにふるまいをおこなう
     */
    excuteBehave() {

      const opponentBehave: TBehave = this.$ButtleSys.selectBehave(this.onHand, this.opponent, 'opponent');
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
    },

    endButtle() {
      // [note]: あとあと経験値処理等を行う

      if (this.winner === 'opponent') {
        // ゲームオーバー処理
      } else {

        const exp = this.$ButtleSys.getExp(this.onHand.level, this.opponent.level, this.opponent.baseExperience);
        const { isLevelUp, level, currentExp } = this.$ButtleSys.saveExp(this.onHand.level, this.onHand.currentExp, exp);

        this.onHand = {
          level,
          currentExp
        };
        console.log(this.onHand);

        this.serifs.push(`${this.opponent.base.name}はたおれた`);
        this.serifs.push(`${this.onHand.nickname}は${exp}の経験値を手に入れた`);

        if (isLevelUp) {
          this.serifs.push(`レベルあがった。${this.onHand.level}になった！`);
        } else {
          this.serifs.push(`レベルあがらん`);
        }

        // ストアへポケモンのステータスを格納し直して登録
        const buttleEndedPokemons: IHandPokemon[] = [];
        const savedPokemon: IHandPokemon = this.$ButtleSys.saveButtleStatusToOnHand(this.onHand);
        buttleEndedPokemons.push(savedPokemon);

        // [note]: anyになるの直したい
        handPokemonsModule.updateOnHandPokemons(buttleEndedPokemons);
      }
    },

  },


  async fetch() {
    const { id } = this.$nuxt.context.query;
    const level: number = Math.floor( Math.random() * ( 5 - 2 ) ) + 2;
    const wildPokemon: IWildPokemon = await this.$Poke.getWildPokemon(id, level);

    // バトル展開
    this.opponent = this.$nuxt.context.$ButtleSys.prepareButtleRequired(wildPokemon);
    const pokemons = handPokemonsModule.pokemons;
    this.onHand = this.$nuxt.context.$ButtleSys.prepareButtleRequired(this._.cloneDeep(pokemons[0]));

    this.serifs.push(`あ！やせいの${this.opponent.base.name}があらわれた`);
    this.serifs.push(`いけ、${this.onHand.nickname}！`);

    // [note]: 残りの手持ちポケモンをthis.otherPokemon格納
    // ポケモン入れ替えの際に活用するため
  },

  watch: {
    buttleStatus() {

      this.currentSerifIndex = 0;
      this.serifs = [];

      if ( this.buttleStatus === 'isSelectBehave') {
        this.serifs.push(`${this.onHand.nickname}はどうする？`);
      }

      if ( this.buttleStatus === 'behaveExecute') {
        this.excuteBehave();
      }

      if ( this.buttleStatus === 'buttleEnd') {
        this.endButtle();
      }
      
      if (this.buttleStatus === 'buttleSave') {
        this.$router.push(`/fields/aaa`);
      }
    }

  }
})

</script>

<style scoped>

.buttlefield {
  margin: 80px 0;
}
.command button {
  display: block;
}

</style>