import { VuexModule, Module, Mutation } from 'vuex-module-decorators' 
import store from "@/store/store"

export interface IGame {
  gaming: boolean;
}

@Module({ stateFactory: true, dynamic: true, store, name: "game" })
export default class Game extends VuexModule {

  game: IGame = {
    gaming: false
  };

  get getIsGaming(): boolean {
    return this.game.gaming;
  }

  @Mutation
  public gameStart() {
    this.game.gaming = true;
  }

  @Mutation
  public gameEnd() {
    this.game.gaming = false;
  }
}