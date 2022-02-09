import { Poke } from '~/plugins/poke';
import { ButtleSystem } from '~/plugins/buttleSys';
import { PokeApi } from '~/plugins/pokeapi';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $Poke: Poke
    readonly $ButtleSys: ButtleSystem
    readonly $PokeApi: PokeApi
  }
}

declare module '@nuxt/types/' {
  interface Context {
    readonly $Poke: Poke
    readonly $ButtleSys: ButtleSystem
    readonly $PokeApi: PokeApi
  }
}
