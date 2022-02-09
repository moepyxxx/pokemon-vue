import Vue from "vue"
import Vuex from "vuex"
import handPokemons from "./modules/handPokemons"
import heroCurrent from "./modules/heroCurrent"

Vue.use(Vuex)

export interface IRootState {
  handPokemons: handPokemons,
  heroCurrent: heroCurrent,
}
export default new Vuex.Store<IRootState>({})