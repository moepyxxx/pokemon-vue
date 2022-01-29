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
import IWildPokemon, { IMove } from '../../interface/IWildPokemon';
import IOnButtle from '../../interface/IOnButtle';

const handPokemonsModule = getModule(HandPokemons);
const pokemons = handPokemonsModule.pokemons;

type TButtleStatus = 'buttleStart' | 'isSelectBehave' | 'behaveExecute' | 'buttleEnd' | 'buttleSave';

type TController = {
  runCount: number;
  actionCount: number;
}

type TButtlePokemon = 'opponent' | 'onHand';

type TAction = 'attack' | 'run' | 'tool' | 'changePokemon';

type TBehave = {
  buttllePokemon: TButtlePokemon;
  action: TAction;
  move?: IMove;
  pokemon: (IWildPokemon|IHandPokemon) & IOnButtle,
  target: (IWildPokemon|IHandPokemon) & IOnButtle
}

type TEffect = {
  type: 'damage' | 'change';
  // [note]: どんな値が入るか見当がつかないため保留
  changeStatus: string;
  raiseOrLower: 'raise' | 'lower';
  changeValue: number;
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
      onHand: pokemons[0],
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

    // バトル開始時にバトルに必要なポケモンの状態を保持する
    setButtle<T extends (IHandPokemon|IWildPokemon)>(pokemon: T) : T & IOnButtle {
      const onButtleInit: IOnButtle = {
        battleStatusRank: {
          attack: 1,
          defense: 1,
          specialAttack: 1,
          specialDefense: 1,
          rapidity: 1,
          critical: 1,
          accuracy: 1,
          evasion: 1,
        }
      }
      return {
        ...pokemon,
        ...onButtleInit
      }
    },

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

    changeButtleStatus(status: TButtleStatus) {
      this.buttleStatus = status;
    },

    /**
     * 自分のふるまいをセット
     */
    selectOnHandBehave(move: IMove) {
      this.selectBehave('onHand', move);
      this.changeButtleStatus('behaveExecute');
    },

    /**
     * お互いにふるまいをおこなう
     */
    excuteBehave() {

      this.selectBehave('opponent');
      this.checkPriority();

      // ダメージ計算・こうげき結果処理
      for (let i = 0; i < this.behaves.length; i++) {
        const { effect, messages } = this.attack(this.behaves[i]);
        this.serifs.push(...messages);
        this.changeStats(effect, this.behaves[i].pokemon, this.behaves[i].target);
        this.checkButtlePokemonStats();

        // 勝者が決まったら処理を終了
        if (this.winner !== null) {
          break;
        }
      }

      // ふるまいをリセット
      this.behaves = [];
    },

    /**
     * ステータスを確認
     */
    checkButtlePokemonStats() {
      if (this.onHand.stats.hp <= 0) {
        this.winner = 'opponent';
      }
      if (this.opponent.stats.hp <= 0) {
        this.winner = 'onHand';
      }
    },

    /**
     * こうげきをおこなう
     */
    attack(behave: TBehave): {
      effect: TEffect,
      messages: string[]
    } {
      
      // [note]: モック処理

      const damage = 10;

      return {
        effect: {
          type: 'damage',
          changeStatus: 'hp',
          raiseOrLower: 'lower',
          changeValue: damage
        },
        messages: [
          `${behave.pokemon.base.name}は${behave.move.name}した！`,
          'こうかはばつぐんだ！',
          `${behave.target.base.name}に${damage}のダメージ`
        ]
      }
    },

    /**
     * ふるまいによってポケモンのステータスを変更する
     */
    changeStats(
      effect: TEffect,
      pokemon: (IHandPokemon|IWildPokemon) & IOnButtle,
      target: (IHandPokemon|IWildPokemon) & IOnButtle
    ) {

      // [note]: もっと条件分岐あるが一旦割愛
      if ( effect.type === 'damage' ) {
        target.stats.hp = effect.raiseOrLower === 'lower' ? target.stats.hp - effect.changeValue : target.stats.hp + effect.changeValue;
      }

      if (target.stats.hp <= 0) {
        target.stats.hp = 0;
      }
    },

    /**
     * ふるまいを選ぶ
     */
    selectBehave(buttlePokemon: TButtlePokemon, move?: IMove) {

      if (buttlePokemon === 'onHand' && !move) return;

      let behave: TBehave;
      if( buttlePokemon === 'onHand') {
        behave = {
          buttllePokemon: 'onHand',
          pokemon: this.onHand,
          target: this.opponent,
          action: 'attack',
          move
        }
      } else {
        const opponentMoveCount: number = this.opponent.moves.length;
        const moveIndex: number = Math.floor( Math.random() * ( opponentMoveCount - 0 ) ) + 0;
        behave = {
          buttllePokemon: 'opponent',
          pokemon: this.opponent,
          target: this.onHand,
          action: 'attack',
          move: this.opponent.moves[moveIndex]
        }
      }
      this.behaves.push(behave);
    },

    /**
     * 戦闘の優先順位を判定する
     */
    checkPriority() {
      this.behaves = this.behaves.sort((next, cur) => {
        // わざの優先度を確認
        if (next.move.priority !== cur.move.priority) {
          if (next.move.priority < cur.move.priority) return 1;
          if (next.move.priority > cur.move.priority) return -1;
        }

        // ポケモンのすばやさを確認
        if (next.pokemon.stats.speed !== cur.pokemon.stats.speed) {
          if (next.pokemon.stats.speed < cur.pokemon.stats.speed) return 1;
          if (next.pokemon.stats.speed > cur.pokemon.stats.speed) return -1;
        }


        // ランダム確認
        const randomNum = Math.floor(Math.random() * 2);
        if (randomNum === 0) {
          return 1;
        } else {
          return -1;
        }

      });
    },

    endButtle() {
      // [note]: あとあと経験値処理等を行う

      if (this.winner === 'opponent') {
        // ゲームオーバー処理
      } else {
        this.serifs.push(`${this.opponent.base.name}はたおれた`);
        this.serifs.push(`${this.onHand.nickname}は経験値を手に入れた`);
      }
    }
  },


  async fetch() {
    const { id } = this.$nuxt.context.query;
    const level: number = Math.floor( Math.random() * ( 5 - 2 ) ) + 2;
    const wildPokemon: IWildPokemon = await this.$Poke.getWildPokemon(id, level);

    // バトル展開
    this.opponent = this.setButtle(wildPokemon);
    this.onHand = this.setButtle(pokemons[0]);

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