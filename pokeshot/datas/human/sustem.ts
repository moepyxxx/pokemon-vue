import { THuman } from "./types";

export const reportSystem: THuman = {
  id: 'reportSystem',
  name: 'システム管理者（レポート）',
  imagename: '',
  actions: [{
    actionId: 'questionreport',
    execute: 'question',
    talk: ['ここまでの 冒険を レポートに 書きますか？'],
    questions: [{
      select: 'はい',
      nextActionId: 'report',
    }, {
      select: 'いいえ',
      nextActionId: 'cancel'
    }]
  }, {
    actionId: 'report',
    execute: 'report',
    nextActionId: 'complete'
  }, {
    actionId: 'complete',
    execute: 'talk',
    talk: ['レポートを 書きおわった']
  }, {
    actionId: 'cancel',
    execute: 'talk',
    talk: ['レポートを 書くのは やめた']
  }]
}