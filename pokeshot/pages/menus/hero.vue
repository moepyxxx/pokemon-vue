<template>
  <div>
    <MenuFlame
      message="あなたの げんざいの ステータスです"
    >
      <div class="hero">
        <div class="status">
          <div class="status-inner">
            <p class="main">つかまえた ポケモン</p>
            <p class="sub">{{ handPokemonModule.pokemonLength.toString() }} 匹</p>
          </div>
          <div class="status-inner">
            <p class="main">もっている バッジ</p>
            <p class="sub">なし</p>
          </div>
          <div class="status-inner">
            <p class="main">いまいる ばしょ</p>
            <p class="sub">{{ currentPlace }}</p>
          </div>
        </div>
        <div class="heroimage">
          <img
          :src="require(`@/assets/img/scenario/${heroModule.getHero.gender.english}.png`)"
          :alt="heroModule.getHero.gender.japanese">
          <p>{{ heroModule.getHero.name }}</p>
        </div>
      </div>
    </MenuFlame>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MenuFlame from '@/component/games/MenuFlame.vue';

import { getModule } from 'vuex-module-decorators'
import HandPokemons from "@/store/modules/handPokemons"
import HeroCurrent from '@/store/modules/heroCurrent';
import Hero from '@/store/modules/hero';
import maps from '~/datas/map';

@Component({
  components: {
    MenuFlame
  }
})
export default class MenusPokemonPage extends Vue {
  heroCurrentModule: HeroCurrent = getModule(HeroCurrent);
  heroModule: Hero = getModule(Hero);
  handPokemonModule: HandPokemons = getModule(HandPokemons);

  get currentPlace(): string {
    const map = maps.find(map =>this.heroCurrentModule.heroCurrent.fieldId === map.id);
    if (!map) {
      throw new Error('今いる場所がわかりません！');
    }
    return map.name;
  }
}

</script>

<style scoped lang="scss">

.hero {
  width: 640px;
  background: linear-gradient(#3FB2AC, #96DEDA);
  padding: 60px 40px;
  display: flex;
  align-items: flex-end;
  border-radius: 4px;
  margin: 40px auto;
  .status {
    background: rgba(#DFEEF0, .7);
    width: 65%;
    padding: 32px;
    border-radius: 4px;
    &-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      p {
        font-size: 15px;
        margin: 0;
      }

      .main {
        width: 50%;
      }

      .sub {
        width: 50%;
        text-align: right;
      }
    }
  }

  .heroimage {
    width: 35%;
    text-align: center;
    img {
      width: 120px;
    }
    p {
      margin: 4px 0 0;
      font-size: 16px;
    }
  }
}
</style>