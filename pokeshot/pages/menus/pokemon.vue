<template>
  <div>
    <MenuFlame
      message="ポケモンを えらんで ください"
    >
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
                <span class="allhp"></span>
                <span class="remainhp" :class="remainHpClass(first.remainHp, first.stats.hp)"></span>
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
                <span class="allhp"></span>
                <span class="remainhp" :class="remainHpClass(other.remainHp, other.stats.hp)"></span>
              </div>
              <div class="n-hp">
                <p>{{ other.remainHp }}  /  {{ other.stats.hp }}</p>
              </div>
            </div>
          </NuxtLink>
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
import IHandPokemon from '~/interface/IHandPokemon';

@Component({
  components: {
    MenuFlame
  }
})
export default class MenusPokemonPage extends Vue {
  handPokemonsModule: HandPokemons = getModule(HandPokemons);

  first: IHandPokemon = this.handPokemonsModule.firstOnHandPokemon;
  others: IHandPokemon[] = this.handPokemonsModule.otherOnHandPokemons;

  remainHpClass(remainHp: number, statshp: number): string[] {
    const ratio = Math.round(remainHp / statshp * 10);

    let dangerColor = 'd-green';
    switch(true) {
      case ratio <= 1:
        dangerColor = 'd-red';
        break;
      case ratio >= 2 && ratio <= 6:
        dangerColor = 'd-yellow';
        break;
      case ratio >= 7:
        dangerColor = 'd-green'
        break;
    }
    return [`ratio-${Number(ratio)}`, dangerColor];
  }

  created() {
    if (!this.first) {
      throw new Error('ポケモンいないよ！');
    }
  }
}

</script>

<style scoped lang="scss">

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
    .allhp {
      position: absolute;
      width: 80%;
      height: 16px;
      top: 2px;
      border-radius: 10px;
      background: #fff;
      right: 2px;
    }
    .remainhp {
      position: absolute;
      width: calc(100% - 20% - 4px);
      height: 12px;
      border-radius: 8px;
      top: 4px;
      left: 20%;

      @for $i from 0 through 10 {
        &.ratio-#{$i} {
          width: calc(calc(calc(100% - 20% - 4px) / 10) * #{$i});
        }
      }

      &.d-green {
        background: #309464;
      }

      &.d-yellow {
        background: #E5D436;
      }

      &.d-red {
        background: #AF0A0A;
      }
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
</style>