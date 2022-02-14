<template>
  <Screen>

    <div
      v-if="
        currentScenario.status === 'greeting' ||
        currentScenario.status === 'getFirstPokemon'"
      class="center">
      <img src="~/assets/img/scenario/odamaki.png" alt="オダマキ博士">
    </div>

    <div v-else-if="currentScenario.status === 'selectGender'" class="center flex">
      <div v-for="(gender, index) in genders" :key="index" class="card">
        <button @click="registerGender(gender)">
          <img
            :src="require(`@/assets/img/scenario/${gender.english}.png`)"
            :alt="gender.japanese"
          />
          <p>{{ gender.japanese }}</p>
        </button>
      </div>
    </div>

    <div v-else-if="currentScenario.status === 'registerName'"  class="center">
      <div class="card">
        <img
          :src="require(`@/assets/img/scenario/${selectedGender.english}.png`)"
          :alt="selectedGender.japanese"
        />
        <p>{{ selectedGender.japanese }}</p>
      </div>
      <div class="form">
        <input type="text" placeholder="5文字いないのなまえ" v-model="heroName" />
        <button class="submit" @click="registerHeroName">これで決定</button>
      </div>
    </div>

    <div v-else-if="currentScenario.status === 'selectPokemon'" class="center flex">
      <div v-for="pokemon in pokemons" :key="pokemon.base.id" class="card">
        <button @click="changeSelectPokemon(pokemon)">
          <img
            :src="require(`@/assets/img/scenario/pokemon/${pokemon.base.id}.png`)"
            :alt="pokemon.base.name"
          />
          <p>{{ pokemon.base.name }}</p>
        </button>
      </div>
    </div>
    
    <div v-else-if="currentScenario.status === 'confirm'" class="center card">
      <img
        :src="require(`@/assets/img/scenario/pokemon/${selectPokemon.base.id}.png`)"
        :alt="selectPokemon.base.name"
      >
      <p>{{ selectPokemon.base.name }}</p>
    </div>

    <div v-else-if="currentScenario.status === 'registerNickname'" class="center">
      <div class="card">
        <img
          :src="require(`@/assets/img/scenario/pokemon/${selectPokemon.base.id}.png`)"
          :alt="selectPokemon.base.name"
        >
        <p>{{ selectPokemon.base.name }}</p>
      </div>
      <div class="form flex flex-column">
        <div>
          <input type="text" placeholder="5文字いないのなまえ" v-model="pokemonNickname" />
          <button class="submit" @click="fixFirstPokemon(true)">これで決定</button>
        </div>
        <div>
          <button class="cancel" @click="fixFirstPokemon(false)">ニックネームはつけない</button>
        </div>
      </div>
    </div>

    <Serif
      :serifs="getSerifs"
      :isQuestion="currentScenario.isQuestion"
      @next="currentScenario.next"
      @back="currentScenario.back"
    />

  </Screen>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Screen from '../component/games/Screen.vue'
import Serif from '../component/games/Serif.vue'
import { getModule } from 'vuex-module-decorators'
import HandPokemons from "../store/modules/handPokemons"
import { pokemonSelectableInFirst } from "../datas/pokemonSelectableInFirst"
import IWildPokemon from '../interface/IWildPokemon'
import IHandPokemon from '../interface/IHandPokemon'
import HeroCurrent, { IHeroCurrent } from '~/store/modules/heroCurrent';
import { THeroGender } from '~/store/modules/hero';
import Hero from '~/store/modules/hero';

const handPokemonsModule = getModule(HandPokemons);
const heroCurrentModule = getModule(HeroCurrent);
const heroModule = getModule(Hero);

type TStatus = 'greeting' | 'selectGender' | 'registerName' | 'selectPokemon' | 'confirm' | 'registerNickname' | 'getFirstPokemon';

export type TScenario = {
  status: TStatus,
  next: () => void,
  back: () => void,
  isQuestion: boolean
}

@Component({
  name: 'StartPage',
  components: {
    Screen,
    Serif
  },

  async asyncData(ctx) {
    
    const pokemons = await Promise.all(pokemonSelectableInFirst.map(async id => {
      const wildPokemon: IWildPokemon = await ctx.$Poke.createWildPokemon(id, 10);
      return { ...wildPokemon };
    }))

    return {
      pokemons
    }

  }
})
export default class StartPage extends Vue {

  pokemons: IHandPokemon[] = [];
  pokemonNickname: string = '';
  selectPokemon: IWildPokemon | null = null;

  scenarios: TScenario[] = [{
    status: "greeting",
    next: this.nextScenario,
    back: this.empty,
    isQuestion: false
  }, {
    status: "selectGender",
    next: this.empty,
    back: this.empty,
    isQuestion: false
  }, {
    status: "registerName",
    next: this.empty,
    back: this.empty,
    isQuestion: false
  }, {
    status: "selectPokemon",
    next: this.empty,
    back: this.empty,
    isQuestion: false    
  }, {
    status: 'confirm',
    next: this.nextScenario,
    back: this.backScenario,
    isQuestion: true
  }, {
    status: 'registerNickname',
    next: this.empty,
    back: this.empty,
    isQuestion: false
  }, {
    status: 'getFirstPokemon',
    next: this.startAdventure,
    back: this.empty,
    isQuestion: false
  }];
  currentScenarioIndex = 0;
  currentScenario: TScenario = this.scenarios[this.currentScenarioIndex];

  genders: THeroGender[] = [{
    english: 'girl',
    japanese: 'おんなのこ'
  }, {
    english: 'boy',
    japanese: 'おとこのこ'
  }]
  selectedGender: THeroGender = {
    english: 'girl',
    japanese: 'おんなのこ'
  };
  heroName: string = '';

  isQuestion: boolean = false;

  next: (() => void) | null = this.empty;
  back: (() => void) | null = this.empty;

  empty() {
    // 何もしない
  }

  get getSerifs(): string[] {
    switch(this.currentScenario.status) {
      case 'greeting':
        return [
          'こんにちは ぼくのなまえは オダマキ博士',
          'これから きみのあいぼうを えらんで たびに でよう'
        ];
      case 'selectGender':
        return [
          'そのまえに まずはあなたのことを教えてもらうよ。 あなたは おとこのこ？ それともおんなのこ？'
        ];
      case 'registerName':
        return [
          'あなたの なまえも 教えてね'
        ];
      case 'selectPokemon':
        return [
          `${heroModule.hero.name} 次はいよいよ きみのさいしょのポケモンを えらぶときだ。さあ どのポケモンにする？`
        ];
      case 'confirm':
        return [
          `ほんとうに この${ this.selectPokemonName }で良いのかな？`
        ];
      case 'registerNickname':
        return [
          `${ this.selectPokemonName }に ニックネームをつけてみるかい？`
        ];
      case 'getFirstPokemon':
        return [
          `あなたは さいしょの あいぼうとして ${ this.selectPokemonName } を選んだね`,
          'それでは 今から たくさんの冒険を はじめてみよう'
        ];
      default:
        return [
          ''
        ];
    }
  }

  get selectPokemonName() {
    return this.selectPokemon?.base.name;
  }

  registerGender(gender: THeroGender) {
    this.selectedGender = gender;
    heroModule.registerHero({
      ...heroModule.hero,
      gender
    })
    this.nextScenario();
  }

  registerHeroName() {
    heroModule.registerHero({
      ...heroModule.hero,
      name: this.heroName
    })
    this.nextScenario();
  }

  changeSelectPokemon(pokemon: IWildPokemon) {
    this.selectPokemon = pokemon;
    this.nextScenario();
  }

  registerPokemonNickname() {
    heroModule.registerHero({
      ...heroModule.hero,
      name: this.heroName
    })
    this.nextScenario();
  }

  // [todo]: ポケモンゲットはどこでも使うためpluginから呼び出す
  fixFirstPokemon(isNickname: boolean) {
    if (!this.selectPokemon) return;

    this.pokemonNickname = isNickname ? this.pokemonNickname : this.selectPokemon.base.name;

    const onHandPokemon: IHandPokemon = this.$Poke.getHandPokemon(this.selectPokemon, this.pokemonNickname);
    handPokemonsModule.addToOnHandPokemon(onHandPokemon);

    this.nextScenario();
  }

  setFirstHeroCurrent() {
    // storeの登録
    const firstHeroCurrent: IHeroCurrent = {
      fieldId: 'touka',
      position: 163,
      direction: 'below'
    }
    heroCurrentModule.updateCurrent(firstHeroCurrent);
  }

  nextScenario() {
    this.currentScenarioIndex++;
    this.currentScenario = this.scenarios[this.currentScenarioIndex];
  }

  backScenario() {
    this.currentScenarioIndex--;
    this.currentScenario = this.scenarios[this.currentScenarioIndex];
  }

  startAdventure() {
    this.setFirstHeroCurrent();
    const { fieldId, position } = heroCurrentModule.heroCurrent;
    this.$router.push(`/maps/${fieldId}?position=${position}`);
  }
}

</script>

<style scoped lang="scss">

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    margin: 0 20px;
  }

  &.flex-column {
    flex-direction: column;
  }
}

.card {
  img {
    width: 80px;
  }

  p {
    font-size: 14px;
  }
}

.form {
  input {
    background: #eee;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
  }

  .submit {
    background: #31A4AB;
    padding: 4px 8px;
    border-radius: 4px;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
  }

  .cancel {
    color: #8f8b8b;
    font-size: 13px;
    margin-top: 10px;
  }
}

</style>