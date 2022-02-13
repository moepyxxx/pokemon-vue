<template>
  <Screen>

    <div v-if="status === 'greeting' || status === 'getFirstPokemon'" class="center">
      <img src="~/assets/img/scenario/odamaki.png" alt="オダマキ博士">
    </div>

    <div v-else-if="status === 'selectGender'" class="center flex">
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

    <div v-else-if="status === 'registerName'"  class="center">
      <div class="card">
        <img
          :src="require(`@/assets/img/scenario/${selectedGender.english}.png`)"
          :alt="selectedGender.japanese"
        />
        <p>{{ selectedGender.japanese }}</p>
      </div>
      <div class="form">
        <input type="text" placeholder="5文字いないのなまえ" :v-model="heroName" />
        <button class="submit" @click="registerHeroName">これで決定</button>
      </div>
    </div>

    <div v-else-if="status === 'selectPokemon'" class="center flex">
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
    
    <div v-else-if="status === 'confirm'" class="center card">
      <img
        :src="require(`@/assets/img/scenario/pokemon/${selectPokemon.base.id}.png`)"
        :alt="selectPokemon.base.name"
      >
      <p>{{ selectPokemon.base.name }}</p>
    </div>

    <div v-else-if="status === 'registerNickname'" class="center">
      <div class="card">
        <img
          :src="require(`@/assets/img/scenario/pokemon/${selectPokemon.base.id}.png`)"
          :alt="selectPokemon.base.name"
        >
        <p>{{ selectPokemon.base.name }}</p>
      </div>
      <div class="form flex flex-column">
        <div>
          <input type="text" placeholder="5文字いないのなまえ" :v-model="pokemonNickname" />
          <button class="submit" @click="fixFirstPokemon(true)">これで決定</button>
        </div>
        <div>
          <button class="cancel" @click="fixFirstPokemon(false)">ニックネームはつけない</button>
        </div>
      </div>
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
import HeroCurrent, { IHeroCurrent } from '~/store/modules/heroCurrent';
import { THeroGender } from '~/store/modules/hero';
import Hero from '~/store/modules/hero';


const handPokemonsModule = getModule(HandPokemons);
const heroCurrentModule = getModule(HeroCurrent);
const heroModule = getModule(Hero);

type TStatus = 'greeting' | 'selectGender' | 'registerName' | 'selectPokemon' | 'confirm' | 'registerNickname' | 'getFirstPokemon' | 'gotoField';

@Component({
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
  selectPokemon: IWildPokemon|null = null;

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

  isFixFirstPokemon: boolean = false;

  status: TStatus = 'greeting';

  isQuestion: boolean = false;
  serifs: string[] = [
    'こんにちは ぼくのなまえは オダマキ博士',
    'これから きみのあいぼうを えらんで たびに でよう'
  ]

  registerGender(gender: THeroGender) {
    this.selectedGender = gender;
    heroModule.registerHero({
      ...heroModule.hero,
      gender
    })
    this.serifs.splice(0);
    this.status = 'registerName';
  }

  registerHeroName() {
    heroModule.registerHero({
      ...heroModule.hero,
      name: this.heroName
    })
    this.serifs.splice(0);
    this.status = 'selectPokemon';
  }

  registerPokemonNickname() {
    heroModule.registerHero({
      ...heroModule.hero,
      name: this.heroName
    })
    this.serifs.splice(0);
    this.status = 'selectPokemon';
  }

  changeSelectPokemon(pokemon: IWildPokemon) {
    this.selectPokemon = pokemon;
    this.serifs.splice(0);
    this.status = 'confirm';
  }

  next() {
    switch (this.status) {
      case 'greeting':
        this.serifs.splice(0);
        this.status = 'selectGender';
        break;
      case 'confirm':
        this.serifs.splice(0);
        this.status = 'registerNickname';
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

  fixFirstPokemon(isNickname: boolean) {
    if (!this.selectPokemon) return;

    this.pokemonNickname = isNickname ? this.pokemonNickname : this.selectPokemon.base.name;

    const onHandPokemon: IHandPokemon = this.$Poke.getHandPokemon(this.selectPokemon, this.pokemonNickname);
    handPokemonsModule.addToOnHandPokemon(onHandPokemon);
    this.isFixFirstPokemon = true;

    this.serifs.splice(0);
    this.status = 'getFirstPokemon';
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

  @Watch('status')
  private changeStatus(status: TStatus, oldStatus: TStatus) {
    switch(status) {
      case 'greeting':
        break;
      case 'selectGender':
        this.serifs.push('そのまえに まずはあなたのことを教えてもらうよ。 あなたは おとこのこ？ それともおんなのこ？');
        break;
      case 'registerName':
        this.serifs.push('それではつぎに あなたの名前を おしえてね');
        break;
      case 'selectPokemon':
        this.serifs.push(`${heroModule.hero.name} 次はいよいよ きみのさいしょのポケモンを えらぶときだ。 さあ どのポケモンにする？`);
        break;
      case 'confirm':
        this.serifs.push(`ほんとうに この${ this.selectPokemon!.base.name }で良いのかな？`);
        this.isQuestion = true;
        break;
      case 'registerNickname':
        this.serifs.splice(0);
        this.isQuestion = false;
        this.serifs.push(`${this.selectPokemon!.base.name}に ニックネームをつけてみるかい？`);
        break;
      case 'getFirstPokemon':
        this.serifs.push(`あなたは さいしょの あいぼうとして ${ this.selectPokemon!.base.name } を選んだね`);
        this.serifs.push(`それでは 旅に でてみよう！`);
        this.setFirstHeroCurrent();
        break;
      case 'gotoField':
        const { fieldId, position } = heroCurrentModule.heroCurrent;
        this.$router.push(`/maps/${fieldId}?position=${position}`);
        break;
    }
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