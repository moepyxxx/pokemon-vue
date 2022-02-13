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
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 4px;
  overflow: hidden;
}
</style>