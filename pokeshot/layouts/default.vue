<template>
  <v-app>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

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