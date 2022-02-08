<template>
  <section>
    <div v-if="isQuestion" class="question">
      <button @click="next">はい</button>
      <button @click="$emit('back')">いいえ</button>
    </div>
    <div v-if="serifs.length !== 0" class="serif" @click="next">
      <p>{{ serifs[currentIndex] }}</p>
      <span>▼</span>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type TData = {
  currentIndex: number;
}

export default Vue.extend({
  name: 'Serif',

  props: {
    serifs: { type: Array as PropType<string[]> },
    nextAction: { type: Function },
    isQuestion: { type: Boolean }
  },

  data(): TData {
    return {
      currentIndex: 0
    }
  },

  methods: {
    next() {
      if ( this.currentIndex < this.serifs.length - 1 ) {
        this.currentIndex++;
      } else {
        this.$emit('next');
        this.currentIndex = 0;
      }
    },
  }
})
</script>

<style scoped>
.question {
  position: absolute;
  bottom: 120px;
  right: 10px;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 10px 20px;
}

.question button {
  display: block;
}

.serif {
  position: absolute;
  width: 780px;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 20px;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  height: 100px;
  cursor: pointer;
}

.serif p {
  margin: 0;
  line-height: 2;
  font-size: 16px;
}

.serif span {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>