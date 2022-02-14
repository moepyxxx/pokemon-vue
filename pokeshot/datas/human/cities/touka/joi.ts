import { THuman } from "../../types";

export const toukaJoi: THuman = {
  id: 'toukaJoi',
  name: 'トウカシティのジョーイさん',
  imagename: 'joi',
  actions: [{
    actionId: 'firstGreeging',
    execute: 'question',
    talk: ['こんにちは ポケモンセンターです お手持ちのポケモンを 回復 させますか？'],
    questions: [{
      select: 'はい',
      nextActionId: 'recoverPokemon',
    }, {
      select: 'いいえ',
      nextActionId: 'lastGreeting'
    }]
  }, {
    actionId: 'recoverPokemon',
    execute: 'recoverPokemon',
    nextActionId: 'talkRecoverComplete'
  }, {
    actionId: 'talkRecoverComplete',
    execute: 'talk',
    talk: ['お手持ちの ポケモンは みんな 元気になりましたよ'],
    nextActionId: 'lastGreeting'
  }, {
    actionId: 'lastGreeting',
    execute: 'talk',
    talk: ['それではまた〜']
  }]
}