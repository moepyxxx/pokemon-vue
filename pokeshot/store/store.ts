import Vue from "vue"
import Vuex from "vuex"
import HandPokemons from "./modules/handPokemons"

Vue.use(Vuex)

export interface IRootState {
  handPokemons: HandPokemons
}
export default new Vuex.Store<IRootState>({})