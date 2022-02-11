export type TDirection = 'above' | 'right' | 'left' | 'below';

export type TField = {
  type: 'river' | 'grassplain' | 'load' | 'grass';
}

export type TObjectAction = {
  execute: 'enterbuilding' | 'gootherfield' | 'stop' | 'jumpdown';
  direction: TDirection;
  fieldId?: string;
}
export type TFieldObject = {
  objectType: 'human' | 'privatehouse' | 'pokemoncenter' | 'forestwall' | 'grass' | 'stonestep',
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