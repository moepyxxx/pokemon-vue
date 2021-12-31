<template>
  <v-app>

    <v-app-bar
      color="white"
      elevation="3"
      app
    >

    <div
      class="d-flex justify-end text-right"
    >
      <div
        class="pa-2"
        v-for="(navi, i) in navis"
        :key="i"
      >
        <v-icon
          medium
          color="blue lighten-1"
        >
          mdi-{{ navi.icon }}
        </v-icon>
        <a :href="navi.linkPath">{{ navi.label }}</a>
      </div>
    </div>

    </v-app-bar>

    <v-main>

      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>


<script lang="ts">
import Vue from 'vue'

type DataType = {
 navis: {
   linkPath: string;
   label: string;
   icon: string;
 }[]
}

export default Vue.extend({
  name: 'DefaultLayout',
  data (): DataType {
    return {
      navis: [{
        linkPath: '/',
        label: 'ホーム',
        icon: 'home'
      }, {
        linkPath: 'search',
        label: 'ポケモンを探しにいく',
        icon: 'crosshairs'
      }]
    }
  }
})
</script>