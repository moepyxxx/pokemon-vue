<template>
  <div>
    <Screen>
      <div class="wrapper">
        <div class="pokemons">
          <div class="first">
            <NuxtLink to="/pokemon-detail/aaa" class="first-inner back">
              <div class="base">
                <div class="img">
                  <img
                    :src="first.base.imageUrl"
                    :alt="first.base.name">
                </div>
                <div class="text">
                  <p class="name">{{ first.nickname }}</p>
                  <span class="other">
                    <p class="level">Lv. {{ first.level }}</p>
                    <p class="gender">
                      <img
                        :src="require(
                          `@/assets/img/game/icon-${first.base.gender === 'オス' ? 'boy' : 'girl'}.svg`
                        )"
                        :alt="first.base.gender">
                    </p>
                  </span>
                </div>
              </div>
              <div class="status">
                <div class="v-hp">
                  HP
                  <span class="remainhp"></span>
                  <span class="allhp"></span>
                </div>
                <div class="n-hp">
                  <p>{{ first.remainHp }}  /  {{ first.stats.hp }}</p>
                </div>
              </div>
            </NuxtLink>
          </div>
          <div class="other">
            <NuxtLink
              to="/pokemon-detail/aaa"
              class="other-inner back"
              v-for="(other, index) in others"
              :key="index"
            >
              <div class="img">
                <img
                  :src="other.base.imageUrl"
                  :alt="other.base.name">
              </div>
              <div class="base">
                <p class="name">{{ other.nickname }}</p>
                <span class="other">
                  <p class="level">Lv. {{ other.level }}</p>
                  <p class="gender">
                    <img
                      :src="require(
                        `@/assets/img/game/icon-${other.base.gender === 'オス' ? 'boy' : 'girl'}.svg`
                      )"
                      :alt="other.base.gender"
                    >
                  </p>
                </span>
              </div>
              <div class="status">
                <div class="v-hp">
                  HP
                  <span class="remainhp"></span>
                  <span class="allhp"></span>
                </div>
                <div class="n-hp">
                  <p>{{ other.remainHp }}  /  {{ other.stats.hp }}</p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div class="description">
          <div class="serifs">
            <p>ポケモンを えらんで ください</p>
          </div>
          <button @click="backToField">戻る</button>
        </div>
      </div>
    </Screen>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Screen from '@/component/games/Screen.vue';

import { getModule } from 'vuex-module-decorators'
import HandPokemons from "@/store/modules/handPokemons"
import HeroCurrent from '@/store/modules/heroCurrent';
import IHandPokemon from '~/interface/IHandPokemon';

@Component({
  components: {
    Screen
  }
})
export default class MenusPokemonPage extends Vue {
  heroCurrent: HeroCurrent = getModule(HeroCurrent);
  handPokemonsModule: HandPokemons = getModule(HandPokemons);

  first: IHandPokemon = this.handPokemonsModule.firstOnHandPokemon;
  others: IHandPokemon[] = this.handPokemonsModule.otherOnHandPokemons;

  backToField() {
    const { fieldId, position } = this.heroCurrent.getHeroCurrent;
    this.$router.push(`/maps/${fieldId}?position=${position}`);
  }

  created() {
    if (!this.first) {
      throw new Error('ポケモンいないよ！');
    }
  }
}

</script>

<style scoped lang="scss">

p {
  margin: 0;
}

.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 32px 60px;
  background: #467B61;
}

.pokemons {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .back {
    background: linear-gradient(#3FB2AC, #96DEDA);
    border-radius: 8px;
    display: inline-block;
    width: 100%;
    text-decoration: none;
    color: #fff;
  }

  & > .first {
    width: 220px;
    margin-top: 40px;
  }

  .first-inner {

    &.back {
      padding: 32px 20px;
    }

    .base {
      display: flex;
      align-items: center;
      .img {
        width: 35%;
        img {
          width: 100%;
          transform: scale(1.5);
        }
      }

      .text {
        width: 65%;
      }
    }

  }

  & > .other {
    width: calc(100% - 220px - 20px);
  }

  .other-inner {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &.back {
      padding: 8px 16px;
    }
    
    .img {
      width: 15%;
      position: relative;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .base {
      width: 35%;
      padding-right: 20px;
      .other {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .gender {
          img {
            vertical-align: middle;
          }
        }
      }
    }

    .status {
      width: 50%;
    }
  }

  .v-hp {
    position: relative;
    width: 100%;
    height: 20px;
    background: #363C32;
    font-size: 12px;
    line-height: 20px;
    padding: 0 12px;
    border-radius: 12px;
    .remainhp {
      position: absolute;
      width: 80%;
      height: 16px;
      top: 2px;
      border-radius: 10px;
      background: #fff;
      right: 2px;
    }
    .allhp {
      position: absolute;
      width: calc(100% - 20% - 4px);
      height: 12px;
      border-radius: 8px;
      top: 4px;
      left: 20%;
      background: #309464;
    }
  }
  .n-hp {
    text-align: right;
    margin-top: 4px;
    p {
      font-weight: bold;
    }
  }

  .text {
    .name {
      margin-bottom: 0;
      font-weight: bold;
      font-size: 16px;
    }
    .other {
      display: flex;
      align-items: center;
      justify-content: space-between;

      p {
        margin: 0;
      }

      .level {
        font-size: 14px;
      }
      .gender {
        img {
          vertical-align: middle;
        }
      }
    }
  }
}

.description {
  position: absolute;
  bottom: 32px;
  left: 60px;
  width: calc(100% - 120px);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .serifs {
    width: 75%;
    border: #1D4A48 solid 4px;
    background: #fff;
    padding: 0 30px;
    border-radius: 12px;
    p {
      line-height: 40px;
    }
  }

  button {
    width: calc(25% - 20px);
    background: #1D4A48;
    border: #1D4A48 solid 4px;
    font-weight: bold;
    border-radius: 12px;
    line-height: 40px;
    color: #fff;
  }
}
</style>