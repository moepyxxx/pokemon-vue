export type TDirection = 'above' | 'right' | 'left' | 'below';

export type TField = {
  type: 'river' | 'grassplain' | 'load' | 'grass';
}

export type TObjectAction = {
  execute: 'enterbuilding' | 'gootherfield' | 'stop' | 'jumpdown';
  direction: TDirection;
}
export type TFieldObject = {
  objectType: 'human' | 'house' | 'forestwall' | 'grass' | 'stonestep',
  objectId?: number,
  startMark: boolean,
  actions?: TObjectAction[]
}


// export type TObjectBuilding = {

// }
// export type TObject = {

// }
// export type TField = {

// }