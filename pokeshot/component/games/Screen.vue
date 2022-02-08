<template>
  <div class="screen">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.screen {
  width: 800px;
  min-height: 480px;
  margin: 40px auto;
  position: relative;
  border: 2px solid #000;
  border-radius: 4px;
  overflow: hidden;
}
</style>