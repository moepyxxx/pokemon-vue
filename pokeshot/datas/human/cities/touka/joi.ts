import { THuman } from "../../types";

export const toukaJoi: THuman = {
  id: 'toukaJoi',
  name: 'トウカシティのジョーイさん',
  imagename: 'joi',
  actions: [{
    actionId: 'initialQuestion',
    question: {
      selects: ['はい','いいえ'],
      result: [{
        selects: 'はい',
        execute: 'recoverPokemon',
        nextActionId: 'talkRecoverComplete'
      }]
    }
  }, {
    actionId: 'talkRecoverComplete',
    talk: ['お手持ちの ポケモンは みんな 元気になりましたよ'],
    nextActionId: 'lastGreeting'
  }, {
    actionId: 'lastGreeting',
    talk: ['それではまた〜']
  }]
}