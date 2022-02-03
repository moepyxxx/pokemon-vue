export type TField = {
  type: 'river' | 'grassplain' | 'load' | 'grass';
}

export type TFieldObject = {
  objectType: 'human' | 'house' | 'forestwall' | 'grass' | 'stonestep',
  objectId?: number,
  startMark: boolean,
  action?: [{
    execute: 'talk' | 'enterbuilding' | 'gootherfield' | 'stop';
    direction: 'above' | 'below' | 'left' | 'right';
  }]
}


// export type TObjectBuilding = {

// }
// export type TObject = {

// }
// export type TField = {

// }