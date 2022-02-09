import { VuexModule, Module, Mutation } from 'vuex-module-decorators' 
import store from "@/store/store"

export interface IHeroCurrent {
  fieldId: number;
  position: number;
}

@Module({ dynamic: true, store, name: "heroCurrent" })
export default class HeroCurrent extends VuexModule {
  heroCurrent: IHeroCurrent = {
    fieldId: 101,
    position: 50
  }

  get current() {
    return this.heroCurrent;
  }

  @Mutation
  public updateCurrent(heroCurrent: IHeroCurrent) {
    this.heroCurrent = heroCurrent;
  }
}