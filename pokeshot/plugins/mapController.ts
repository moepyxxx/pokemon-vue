import { Plugin } from "@nuxt/types";
import { Context, Inject } from "@nuxt/types/app";
import { TDirection, TField, TFieldObject, TObjectAction, TObjectType, TTrigger } from "~/datas/map/types";
import { TPosition } from '@/types/position';
import { identity } from "lodash";

const defineMapController: Plugin = ( ctx: Context, inject: Inject ) => {
  inject('MapController', new MapController());
}
export default defineMapController

type TImgDirectory = 'building' | 'interior' | 'load' | 'pokemoncenter';

export class MapController {

  fieldObjectTypes: { key: TObjectType, directory: TImgDirectory, alt: string }[] = [{
    key: 'privatehouse',
    directory: 'building',
    alt:  '民家',
  }, {
    key: 'pokemoncenter',
    directory: 'building',
    alt: 'ポケモンセンター'
  }, {
    key: 'table',
    directory: 'interior',
    alt: 'テーブル',
  }, {
    key: 'yellowchair',
    directory: 'interior',
    alt: '黄色い椅子'
  }, {
    key: 'pinkchair',
    directory: 'interior',
    alt: 'ピンクの椅子'
  }, {
    key: 'grass',
    directory: 'load',
    alt: '草むら'
  }, {
    key: 'stonestep',
    directory: 'load',
    alt: '段差',
  }, {
    key: 'forestwall',
    directory: 'load',
    alt: '木の壁',
  }, {
    key: 'bookshelf',
    directory: 'interior',
    alt: '本棚'
  }, {
    key: 'plant',
    directory: 'interior',
    alt: '植木鉢',
  }, {
    key: 'computer',
    directory: 'pokemoncenter',
    alt: 'パソコン'
  }, {
    key: 'recoverysystem',
    directory: 'pokemoncenter',
    alt: 'ポケモン回復システム'
  }];

  getNextPosition(currentPosition: number, direction: TDirection, position: TPosition): number {
    switch (direction) {
      case 'above':
        return this.getNextAbovePosition(currentPosition, position);
      case 'below':
        return this.getNextBelowPosition(currentPosition, position);
      case 'left':
        return this.getNextLeftPosition(currentPosition);
      case 'right':
        return this.getNextRightPosition(currentPosition);
    }
  }

  getNextLeftPosition(currentPosition: number): number {
    return currentPosition - 1;
  }

  getNextRightPosition(currentPosition: number): number {
    return currentPosition + 1;
  }

  getNextAbovePosition(currentPosition: number, position: TPosition): number {
    return currentPosition - position.row;
  }

  getNextBelowPosition(currentPosition: number, position: TPosition): number {
    return currentPosition + position.row;
  }

  getReverseDirection(direction: TDirection): TDirection {
    switch (direction) {
      case 'left':
        return 'right';
      case 'right':
        return 'left';
      case 'above': 
        return 'below';
      case 'below':
        return 'above';
    }
  }

  checkGoOtherField(fieldObjects: TFieldObject[] , nextPosition: number, _direction: TDirection): false | {
    id: string,
    direction: TDirection,
    position: number
  } {
    const nextFieldObject: TFieldObject = fieldObjects[nextPosition];
    if (!nextFieldObject || !nextFieldObject.actions) return false;

    const otherFieldObject: TObjectAction | undefined = nextFieldObject.actions.
      find(action => action.execute === 'gootherfield' && action.otherField?.direction === _direction);

    if (!otherFieldObject || !otherFieldObject.otherField) return false;

    const { id, direction, position } = otherFieldObject.otherField;

    return {
      id,
      direction,
      position
    }
  }

  async checkAppearWildPokemon(fields: TField[], currentPosition: number) {
    if (fields[currentPosition].type !== 'grass') return;
    const rand = Math.random();
    const isAppear = rand < 0.3 ? true : false;
    return isAppear;
  }

  checkAction(
    trigger: TTrigger,
    fieldObjects: TFieldObject[] ,
    nextPosition: number,
    direction: TDirection
  ): false | TObjectAction[] {
    
    const reverseDirection: TDirection = this.getReverseDirection(direction);

    let isActions: false | TObjectAction[] = false;

    // 道路のオブジェクトがnullのとき
    if ( !fieldObjects[nextPosition] ) {
      isActions = false;
    } else {

      const actions: TObjectAction[] | undefined = fieldObjects[nextPosition].actions?.filter(
        (action: TObjectAction) => action.direction === reverseDirection && action.trigger === trigger
      );
      isActions = actions ? actions : false;
    }

    return isActions
  }

  isNextPositionvalid(nextPosition: number, allPosition: number) {
    return nextPosition >= 0 && nextPosition < allPosition;
  }

  // this.$MapController.humanChangeDirection(this.fieldObjects[this.currentPosition], this.direction);
  humanChangeDirection(fieldObjects: TFieldObject[], currentPosition: number, heroDirection: TDirection, position: TPosition) {

    const nextPosition = this.getNextPosition(currentPosition, heroDirection, position);
    const humanObject: TFieldObject = fieldObjects[nextPosition];
    if (!humanObject || humanObject.objectType !== 'human') return;

    const humanDirection = this.getReverseDirection(heroDirection);

    humanObject.objectDetail!.direction = humanDirection;
  }
}