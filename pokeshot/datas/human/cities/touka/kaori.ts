import { THuman } from "../../types";

export const kaori: THuman = {
  id: 'kaori',
  name: 'おとなのおねえさんのカオリ',
  imagename: 'obocchama',
  actions: [{
    actionId: 'greeting',
    execute: 'talk',
    talk: ['まあ あなたのポケモンちゃん。とっても あなたのことが 大好き みたい', 'もちろん わたしのポケモンちゃんも わたしのことが 大好き なのよ']
  }]
}