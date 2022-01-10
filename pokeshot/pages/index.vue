<template>
  <div class="align-center">
    <h1>ポケモンを探してスクショしましょう！</h1>
    <br />
    <br />
    <p>ポケモンを探しにいこう</p>

    <div v-for="(region, i) in regions" :key="i">
      <NuxtLink :to="'/region/' + region.id">{{ region.name }}</NuxtLink>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type TRegion = {
  name: string,
  id: number
};

export default Vue.extend({
  name: 'IndexPage',
  async asyncData({ $axios }) {
    const POKE_API_REGION_URL = "https://pokeapi.co/api/v2/region";
    const { results } = await $axios.$get(`${POKE_API_REGION_URL}?limit=3`);
    const urls: string[] = results.map(result => result.url);
    const regions: TRegion[] = await Promise.all(urls.map(async (url) => {
      const region = await $axios.$get(url);
      return {
        name: region.names[0].name,
        id: Number(region.id)
      }
    }));
    return { regions };
  },
})

</script>
