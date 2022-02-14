import { THuman } from "../../types";

export const yoshihiko: THuman = {
  id: 'yoshihiko',
  name: 'おぼっちゃまのヨシヒコ',
  imagename: 'obocchama',
  actions: [{
    actionId: 'greeting',
    execute: 'talk',
    talk: ['知っていたか？ ここでは どんなポケモンも むりょうで回復できるんだぜ', 'だからしょみんも 快適にたびができるってわけだ']
  }]
}