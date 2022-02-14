<template>
  <section>
    <div v-if="isQuestion" class="question">
      <button @click="nextAction">はい</button>
      <button @click="$emit('back')">いいえ</button>
    </div>
    <div v-if="serifs.length !== 0" class="serif" @click="nextAction">
      <p>{{ serifs[currentIndex] }}</p>
      <span>▼</span>
    </div>
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Serif extends Vue {

  currentIndex: number = 0;

  @Prop({ type: Array as PropType<string[]> })
  serifs!: string[];

  @Prop({ type: Function as () => Function | null })
  next!: () => void;

  @Prop({ type: Function as () => Function | null })
  back!: () => void;

  @Prop({ type: Boolean })
  isQuestion!: boolean;

  nextAction() {
    if ( this.currentIndex < this.serifs.length - 1 ) {
      this.currentIndex++;
    } else {
      this.$emit('next');
      this.currentIndex = 0;
    }
  }
}
</script>

<style scoped lang="scss">

.question {
  position: absolute;
  bottom: 120px;
  right: 10px;
  border: 4px solid #31A4AB;
  border-radius: 12px;
  padding: 10px 20px;

  button {
    display: block;
  }
}

.serif {
  position: absolute;
  width: 780px;
  border-radius: 32px;
  padding: 20px 48px;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  height: 100px;
  cursor: pointer;
  background: #31A4AB;
  z-index: 10;

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 92%;
    height: 90%;
    background: #fff;
    z-index: 11;
    border-radius: 24px;
  }

  p {
    margin: 0;
    line-height: 2;
    font-size: 16px;
    position: relative;
    z-index: 12;
  }

  span {
    position: absolute;
    bottom: 12px;
    right: 48px;
    z-index: 12;
  }
}

</style>