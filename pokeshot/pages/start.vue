<template>
  <Screen>
    <div v-if="status === 'selectPokemon'">
      <div v-for="pokemon in pokemons" :key="pokemon.id">
        <button @click="changeSelectPokemon(pokemon)">{{ pokemon.base.name }}</button>
      </div>
    </div>
    <div v-else-if="status === 'confirm'">
      <p>あなたが選んだポケモン：{{ selectPokemon.base.name }}</p>
    </div>
    <Serif
      :serifs="serifs"
      :isQuestion="isQuestion"
      @next="next"
      @back="back"
    />
  </Screen>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import Screen from '../component/games/Screen.vue'
import Serif from '../component/games/Serif.vue'
import { getModule } from 'vuex-module-decorators'
import HandPokemons from "../store/modules/handPokemons"
import { pokemonSelectableInFirst } from "../datas/pokemonSelectableInFirst"
import IWildPokemon from '../interface/IWildPokemon'
import IHandPokemon from '../interface/IHandPokemon'

const handPokemonsModule = getModule(HandPokemons);
const pokemons = handPokemonsModule.pokemons;

type TStatus = 'greeting' | 'selectPokemon' | 'confirm' | 'getFirstPokemon' | 'gotoField';

@Component({
  components: {
    Screen,
    Serif
  },

  async asyncData(ctx) {
    
    const pokemons = await Promise.all(pokemonSelectableInFirst.map(async id => {
      const wildPokemon: IWildPokemon = await ctx.$Poke.getWildPokemon(id, 10);
      return { ...wildPokemon };
    }))

    return {
      pokemons
    }

  }
})

export default class StartPage extends Vue {

  pokemons?: IHandPokemon[];

  nickname: string = '';
  selectPokemon: IWildPokemon|null = null;
  isFixFirstPokemon: boolean = false;
  status: TStatus = 'greeting';
  isQuestion: boolean = false;
  serifs: string[] = [
    'こんにちは ぼくのなまえは オダマキ博士',
    'これから きみのあいぼうを えらんで たびに でよう',
    'きみは どの ポケモンを えらぶかな？',
  ]

  changeSelectPokemon(pokemon: IWildPokemon) {
    this.selectPokemon = pokemon;
    this.status = 'confirm';
  }

  next() {
    switch (this.status) {
      case 'greeting':
        this.serifs.splice(0);
        this.status = 'selectPokemon';
        break;
      case 'confirm':
        this.serifs.splice(0);
        this.status = 'getFirstPokemon';
        break;
      case 'getFirstPokemon':
        this.serifs.splice(0);
        this.status = 'gotoField';
        break;
    }
  }

  back() {
    switch (this.status) {
      case 'confirm':
        this.serifs.splice(0);
        this.isQuestion = false;
        this.status = 'selectPokemon';
        break;
    }
  }

  fixFirstPokemon() {
    if (!this.selectPokemon) return;

    const onHandPokemon: IHandPokemon = this.$Poke.getHandPokemon(this.selectPokemon, this.nickname);
    handPokemonsModule.addToOnHandPokemon(onHandPokemon);
    this.isFixFirstPokemon = true;
  }

  @Watch('status')
  private changeStatus(status: TStatus, oldStatus: TStatus) {
    switch(status) {
      case 'greeting':
        break;
      case 'confirm':
        this.serifs.push(`ほんとうに この${ this.selectPokemon ? this.selectPokemon.base.name : 'ダミー' }で良いのかな？`);
        this.isQuestion = true;
        break;
      case 'getFirstPokemon':
        this.isQuestion = false;
        this.fixFirstPokemon();
        this.serifs.push(`あなたは さいしょの あいぼうとして ${ this.selectPokemon ? this.selectPokemon.base.name : 'ダミー' } を選んだね`);
        this.serifs.push(`それでは 旅に でてみよう！`);
        break;
      case 'gotoField':
        this.$router.push("/fields/101");
        break;
    }
  }
}

</script>
