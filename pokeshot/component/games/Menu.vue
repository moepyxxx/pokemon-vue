<template>
  <section class="menu" v-if="isMenuActive">
    <ul>
      <li><NuxtLink to="/menus/pokemon">ポケモン</NuxtLink></li>
      <li><NuxtLink to="/menus/bag">バッグ</NuxtLink></li>
      <li><NuxtLink to="/menus/hero">もえこ</NuxtLink></li>
      <li><NuxtLink to="" @click="console.log('hoge')">レポート</NuxtLink></li>
    </ul>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Menu extends Vue {
  @Prop({ type: Boolean })
  isMenuActive!: boolean;
}
</script>

<style scoped lang="scss">
.menu {
  position: absolute;
  top: 10px;
  right: 10px;
  border: 4px solid #31A4AB;
  background: #fff;
  border-radius: 12px;
  padding: 20px 28px;
  z-index: 15;

  ul {
    padding: 0;
    li {
      text-decoration: none;
      line-height: 2;
      &::marker {
        content: none;
      }
      a {
        text-decoration: none;
      }
    }
  }
}

</style>