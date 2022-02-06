<template>
  <div class="controller">
    <button @click="$emit('controllAbove')">↑</button>
    <button @click="$emit('controllLeft')">←</button>
    <button @click="$emit('controllRight')">→</button>
    <button @click="$emit('controllBelow')">↓</button>
  </div>
</template>

<style scoped>

.controller {
  text-align: center;
  width: 700px;
  margin: 40px auto 0;
}

.controller button {
  width: 40px;
  height: 40px;
  background: rgb(219, 100, 15);
  box-shadow: 0 4px 0 rgb(129, 64, 17);
  border-radius: 50%;
  margin: 0 20px;
  font-weight: bold;
  color: #fff;
  transition: .5s all;
  font-weight: bold;
}

.controller button:active {
  box-shadow: none;
  transform: translateY(4px);
}
</style>