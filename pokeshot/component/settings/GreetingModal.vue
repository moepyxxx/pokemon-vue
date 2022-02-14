<template>
  <section class="modal" v-if="isModalActive">
    <div class="modal-bg"></div>
    <div class="modal-main">

      <div class="title">
        <h1>どうぞご了承ください</h1>
      </div>

      <div class="contents">
        <ul>
          <li>趣味の個人開発の範疇で制作したものであり、私自身はポケモンとそれを取り巻く会社さまとは何の関係もありません（大変悲しいことですが…）。</li>
          <li>素材は下記の素材屋さんからお借りしています。それ以外については私がSVG画像を自作しています。</li>
          <li>ゲームを進めていただく中で、課金を促すようなメッセージは一切でてきません。また、課金機能もついていません。</li>
        </ul>
      </div>

      <div class="subtitle">
        <h2>素材屋さんでお借りしました</h2>
      </div>

      <div class="link">
        <ul>
          <li><a href="http://hikochans.com/" target="_blank">ひこちゃんずさん</a>のドット画像</li>
          <li><a href="https://pokeapi.co/" target="_blank">PokeAPIさん</a>のapi内画像をお借りしています</li>
        </ul>
      </div>

      <div class="subtitle">
        <h2>機能開発の参考にさせていただきました</h2>
      </div>

      <div class="link">
        <ul>
          <li><a href="https://wiki.xn--rckteqa2e.com/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8" target="_blank">ポケモンWikiさん</a></li>
          <li><a href="https://pokeinfo.net/" target="_blank">ポケモン情報ねっとさん</a></li>
          <li><a href="https://s-yqual.com/blog/1324" target="_blank">PHPポケモンさん</a></li>
        </ul>
      </div>

      <button @click="isModalActive = false">わかったよ！</button>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Serif extends Vue {
  isModalActive: boolean = true;
}

</script>

<style scoped lang="scss">

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vw;
  &-bg {
    background: rgba(0, 0, 0, .44);
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vw;
  }

  &-main {
    margin-top: 50px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #F4F4F4;
    border-radius: 12px;
    width: 800px;
    padding: 40px;
  }

  .title {
    margin-bottom: 30px;

    h1 {
      font-size: 36px;
    }
  }

  .subtitle {
    margin-bottom: 12px;

    h2 {
      font-size: 24px;
    }
  }

  .link {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .contents {
    margin-bottom: 30px;
  }

  ul {
    li {
      font-size: 14px;
      line-height: 1.8rem;
    }
  }

  button {
    background: #31A4AB;
    padding: 12px 16px;
    border-radius: 8px;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }
}

</style>