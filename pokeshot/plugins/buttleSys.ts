import { Plugin } from "@nuxt/types";
import { Context, Inject } from "@nuxt/types/app";
import IWildPokemon, { IMove, IStats } from "~/interface/IWildPokemon";
import IHandPokemon from "~/interface/IHandPokemon";
import IOnButtle from "~/interface/IOnButtle";

export type TAction = 'attack' | 'run' | 'tool' | 'changePokemon';
export type TButtlePokemon = 'opponent' | 'onHand';

export type TBehave = {
  buttlePokemon: TButtlePokemon;
  action: TAction;
  move: IMove;
  pokemon: (IWildPokemon|IHandPokemon) & IOnButtle,
  target: (IWildPokemon|IHandPokemon) & IOnButtle
}

export type TEffect = {
  type: 'damage' | 'change';
  // [note]: どんな値が入るか見当がつかないため保留
  changeStats: string;
  raiseOrLower: 'raise' | 'lower';
  changeValue: number;
}

const defineButtleSystem: Plugin = ( ctx: Context, inject: Inject ) => {

  const buttleSys: ButtleSystem = new ButtleSystem();
  inject('ButtleSys', buttleSys);
}
export default defineButtleSystem

export class ButtleSystem {

  constructor () {
  }

  /**
   * バトル開始時にバトルに必要なポケモンの状態をセット
   */
  prepareButtleRequired<T extends (IHandPokemon|IWildPokemon)>(pokemon: T) : T & IOnButtle {
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
  }


  /**
   * バトルに必要なポケモンの状態を解放して返す
   */
  saveButtleStatusToOnHand<T extends IHandPokemon & IOnButtle>(onHand: T): IHandPokemon {
    return {
      ...onHand
    }
  }


  /**
   * 戦闘の優先順位を判定する
   */
  checkPriority(behaves: TBehave[]) : TBehave[] {
    return behaves.sort((next, cur) => {

      if (next.move === undefined || cur.move === undefined) return 1;

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
      const randomNum = this.getRandNum(0, 1);
      if (randomNum === 0) {
        return 1;
      } else {
        return -1;
      }

    });
  }


  getRandNum(min: number, max: number) {
    return Math.floor( Math.random() * ( max - min ) ) + min;
  }


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
        changeStats: 'hp',
        raiseOrLower: 'lower',
        changeValue: damage
      },
      messages: [
        `${behave.pokemon.base.name}は${behave.move?.name}した！`,
        'こうかはばつぐんだ！',
        `${behave.target.base.name}に${damage}のダメージ`
      ]
    }
  }


  /**
   * ふるまいによるポケモンのステータスを変更する
   */
  changeStats
    <T extends (IHandPokemon|IWildPokemon) & IOnButtle>
    (effect: TEffect, behavor: T, target: T) 
    : { behavor: IStats, target: IStats }
  {
    const behavorStats = {...behavor.stats};
    const targetStats = {...target.stats};

    // [note]: もっと条件分岐あるが一旦割愛
    if ( effect.type === 'damage' ) {
      targetStats.hp = effect.raiseOrLower === 'lower' ? targetStats.hp - effect.changeValue : targetStats.hp + effect.changeValue;
    }

    if (targetStats.hp <= 0) {
      targetStats.hp = 0;
    }

    return {
      behavor: behavorStats,
      target: targetStats
    }
  }


  /**
   * ステータスを確認
   */
  checkButtlePokemonStats
    <T extends (IWildPokemon|IHandPokemon) & IOnButtle>
    (onHand: T, opponent: T) : null | TButtlePokemon
  {

    let winner: null|TButtlePokemon = null;

    if (onHand.stats.hp <= 0) {
      winner = 'opponent';
    }
    if (opponent.stats.hp <= 0) {
      winner = 'onHand';
    }

    return winner;
  }


  /**
   * ふるまいを選ぶ
   */
  selectBehave
    <T extends (IWildPokemon|IHandPokemon) & IOnButtle>
    (onHand: T, opponent: T, buttlePokemon: TButtlePokemon, move: IMove|null)
    : TBehave|never
  {

    if ( buttlePokemon === 'onHand' ) {

      if (!move) {
        throw Error('ポケモンのわざが選択されていません！');
      };

      const behave: TBehave = {
        buttlePokemon: 'onHand',
        pokemon: onHand,
        target: opponent,
        action: 'attack',
        move
      }
      return behave;

    } else {
      const opponentMoveCount: number = opponent.moves.length;
      const moveIndex: number = Math.floor( Math.random() * ( opponentMoveCount - 0 ) ) + 0;

      const behave: TBehave = {
        buttlePokemon: 'opponent',
        pokemon: opponent,
        target: onHand,
        action: 'attack',
        move: opponent.moves[moveIndex]
      }
      return behave;
    }

  }


  /**
   * 取得経験値を計算する
   */
  getExp(onHandLevel: number, opponentLevel: number, opponentBaseExperience: number) {
    // 経験値計算（ポケモンwikiから概算）
    const experiense = opponentLevel * opponentBaseExperience / 5;
    const levelCorrection = ( 2 * opponentLevel + 10) / ( opponentLevel + onHandLevel + 10 );
    return Math.round(experiense * (levelCorrection ** 2.5) + 1);
  }


  /**
   * 経験値を自らのステータスへ反映する
   */
  saveExp(onHand: IHandPokemon & IOnButtle, exp: number) : {
    isLevelUp: boolean,
    onHand: IHandPokemon & IOnButtle
  } {
    onHand.currentExp+= exp;

    let isLevelUp = false;
    let level = onHand.level;
    while (onHand.currentExp >= (level + 1) ** 2) {
      onHand.level++;
      isLevelUp = true;
      level++;
    }

    return {
      onHand,
      isLevelUp
    }
  }

  
  /**
   * 次の場所までに必要な経験値を得る
   */
  getNeedNextLevelExp(onHand: IHandPokemon) {
    // [note]: 計算方法
    // 100万タイプですべて統一
    // https://wiki.xn--rckteqa2e.com/wiki/%E7%B5%8C%E9%A8%93%E5%80%A4%E3%82%BF%E3%82%A4%E3%83%97#100.E4.B8.87.E3.82.BF.E3.82.A4.E3.83.97
    return (onHand.level + 1)** 2 - (onHand.currentExp - (onHand.level ** 2) );
  }
}