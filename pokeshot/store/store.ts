import Vue from "vue"
import Vuex from "vuex"
import handPokemons from "./modules/handPokemons"

Vue.use(Vuex)

export interface IRootState {
  handPokemons: handPokemons
}
export default new Vuex.Store<IRootState>({})