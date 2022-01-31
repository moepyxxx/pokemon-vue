export type TField = {
  type: 'river' | 'grassplain' | 'load';
}

export type TFieldObject = {
  cordinateIndex: number[],
  objectType: 'human' | 'house' | 'forestwall' | 'grass' | 'stonestep',
  // 要素の重なりを制御
  // [note]: 草むらのなかにトレーナーがいる場合があるため
  overLapping?: number,
  action?: {
    execute: 'talk' | 'enterbuilding' | 'gootherfield';
    // そのアクションができる面（例：家系は下指定でないとだめ（下エリアからしか入れないため））
    direction: 'top' | 'bottom' | 'left' | 'right';
  }
}

