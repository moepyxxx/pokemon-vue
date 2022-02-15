import Vue from "vue"
import Vuex from "vuex"
import Game from "./modules/game"
import handPokemons from "./modules/handPokemons"
import heroCurrent from "./modules/heroCurrent"
import Hero from "./modules/hero"

Vue.use(Vuex)

export interface IRootState {
  handPokemons: handPokemons,
  heroCurrent: heroCurrent,
  hero: Hero,
  game: Game
}
export default new Vuex.Store<IRootState>({})