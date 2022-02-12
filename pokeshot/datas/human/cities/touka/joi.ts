import { THuman } from "../../types";

export const toukaJoi: THuman = {
  id: 'toukaJoi',
  name: 'トウカシティのジョーイさん',
  imagename: 'joi',
  actions: [{
    actionId: 'recoverPokemonQuestion',
    question: {
      selects: ['はい','いいえ'],
      result: [{
        selects: 'はい',
        execute: 'recoverPokemon',
        nextActionId: 'talkRecoverComplete'
      }]
    }
  }, {
    actionId: 'recoverPokemon',
    execute: 'recoverPokemon',
    nextActionId: 'talkRecoverComplete'
  }, {
    actionId: 'firstGreeging',
    talk: ['こんにちは ポケモンセンターです。', 'お手持ちのポケモンを 回復 させますか？'],
    nextActionId: 'recoverPokemonQuestion'
  }, {
    actionId: 'talkRecoverComplete',
    talk: ['お手持ちの ポケモンは みんな 元気になりましたよ'],
    nextActionId: 'lastGreeting'
  }, {
    actionId: 'lastGreeting',
    talk: ['それではまた〜']
  }]
}