import { Poke } from '~/plugins/poke';
import { ButtleSystem } from '~/plugins/buttleSys';
import { PokeApi } from '~/plugins/pokeapi';
import { MapController } from './mapController';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $Poke: Poke
    readonly $ButtleSys: ButtleSystem
    readonly $MapController: MapController
    readonly $PokeApi: PokeApi
  }
}

declare module '@nuxt/types/' {
  interface Context {
    readonly $Poke: Poke
    readonly $ButtleSys: ButtleSystem
    readonly $MapController: MapController
    readonly $PokeApi: PokeApi
  }
}
