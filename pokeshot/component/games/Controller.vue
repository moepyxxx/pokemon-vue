<template>
  <div class="controller">

    <div class="left">
      <button class="direction direction-above" @click="$emit('controllAbove')">↑</button>
      <button class="direction direction-left" @click="$emit('controllLeft')">←</button>
      <button class="direction direction-right" @click="$emit('controllRight')">→</button>
      <button class="direction direction-bottom" @click="$emit('controllBelow')">↓</button>
    </div>

    <div class="right">
      <button class="button button-a" @click="$emit('controllAPush')">A</button>
      <button class="button button-b">B</button>
    </div>

  </div>
</template>

<style scoped lang="scss">

.controller {
  text-align: center;
  width: 700px;
  margin: 40px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .left, .right {
    width: 132px;
    height: 132px;
    position: relative;
  }

  .left {
    margin-right: 30px;
  }

  .right {
    margin-left: 30px;
  }

  .direction {
    width: 40px;
    height: 40px;
    font-weight: bold;
    color: #fff;
    transition: .5s all;
    font-weight: bold;
    background: rgb(88, 83, 78);
    box-shadow: 0 4px 0 rgb(20, 19, 19);
    position: absolute;
    &:active {
      box-shadow: none;
      transform: translateY(4px);
    }

    &.direction-above {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    &.direction-left {
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &.direction-right {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &.direction-bottom {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }


  .button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-weight: bold;
    color: #fff;
    transition: .5s all;
    font-weight: bold;
    background: rgb(219, 100, 15);
    box-shadow: 0 4px 0 rgb(129, 64, 17);
    position: absolute;
    
    &:active {
      box-shadow: none;
      transform: translateY(4px);
    }

    &.button-a {
      top: 20px;
      right: 20px;
    }
    &.button-b {
      bottom: 20px;
      left: 20px;
    }
  }
}

</style>