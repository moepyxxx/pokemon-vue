import { VuexModule, Module, Mutation } from 'vuex-module-decorators' 
import store from "@/store/store"

export type THeroGender = {
  english: string,
  japanese: string
};

export interface IHero {
  gender: THeroGender;
  name: string;
}

@Module({ dynamic: true, store, name: "hero" })
export default class HeroCurrent extends VuexModule {
  hero: IHero = {
    gender: {
      english: 'girl',
      japanese: 'おんなのこ'
    },
    name: ''
  }

  get getHero() {
    return this.hero;
  }

  @Mutation
  public registerHero(hero: IHero) {
    this.hero = hero;
  }
}