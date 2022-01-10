<template>
  <div class="align-center">
    <br />
    <h1>{{ region.name }} にきたよ！</h1>
    <br />
    <br />

  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type TRegion = {
  name: string,
  id: number
};

type TData = {
  region: TRegion
}

export default Vue.extend({
  data(): TData {
    return {
      region: null
    }
  },
  async asyncData({ params, $axios }) {
    const { id } = params;
    const POKE_API_REGION_URL = "https://pokeapi.co/api/v2/region/";
    const result = await $axios.$get(POKE_API_REGION_URL + id);
    const name = result.names.find(obj => obj.language.name === 'ja-Hrkt').name;
    const region = { id, name }
    return { region };
  }
})
</script>