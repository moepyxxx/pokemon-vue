import { VuexModule, Module, Mutation } from 'vuex-module-decorators' 
import store from "@/store/store"
import { TDirection } from '~/datas/map/types';

export interface IHeroCurrent {
  fieldId: string;
  position: number;
  direction: TDirection;
}

@Module({ dynamic: true, store, name: "heroCurrent" })
export default class HeroCurrent extends VuexModule {
  heroCurrent: IHeroCurrent = {
    fieldId: '101',
    position: 50,
    direction: 'below'
  }

  get current() {
    return this.heroCurrent;
  }

  @Mutation
  public updateCurrent(heroCurrent: IHeroCurrent) {
    this.heroCurrent = heroCurrent;
  }
}