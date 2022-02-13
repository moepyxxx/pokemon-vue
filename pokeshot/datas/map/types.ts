export type TDirection = 'above' | 'right' | 'left' | 'below';

export type TField = {
  type: 'river' | 'grassplain' | 'load' | 'grass' | 'nofield' | 'floora' | 'floorb' | 'carpet';
}

export type TTrigger = 'move' | 'push-a';

export type TObjectAction = {
  execute: 'gootherfield' | 'stop' | 'jumpdown' | 'talk';
  direction?: TDirection;
  otherField?: {
    id: string;
    direction: TDirection;
    position: number;
  }
  trigger: TTrigger;
  talk?: {
    humanId: string,
    actionId: string
  }
}

export type TObjectType = 'human' | 'privatehouse' | 'pokemoncenter' | 'none' |
                          'forestwall' | 'grass' | 'stonestep' | 'buildingwall' |
                          'computer' | 'recoverysystem' | 'bookshelf' | 'table' | 'yellowchair' | 'pinkchair' | 'plant';

export type TFieldObject = {
  objectType: TObjectType,
  objectDetail?: {
    humanId: string,
    direction: TDirection,
  },
  objectId?: number,
  startMark: boolean,
  actions?: TObjectAction[],
}