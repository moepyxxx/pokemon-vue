<template>
  <div>
    <Screen>
      <div class="wrapper">
        <slot />
        <div class="description">
          <div class="serifs">
            <p>{{ message }}</p>
          </div>
          <button @click="backToField">戻る</button>
        </div>
      </div>
    </Screen>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Screen from '@/component/games/Screen.vue';

import { getModule } from 'vuex-module-decorators'
import HeroCurrent from '@/store/modules/heroCurrent';
import Hero from '@/store/modules/hero';

@Component({
  name: 'MenuFlame',
  components: {
    Screen
  }
})
export default class MenuFlame extends Vue {
  heroCurrent: HeroCurrent = getModule(HeroCurrent);
  hero: Hero = getModule(Hero);

  @Prop({ type: String })
  message!: string;
  
  backToField() {
    const { fieldId, position } = this.heroCurrent.getHeroCurrent;
    this.$router.push(`/maps/${fieldId}?position=${position}`);
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