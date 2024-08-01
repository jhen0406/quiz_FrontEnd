<script>
import { RouterLink, RouterView } from "vue-router";

export default {
  data() {
    return {};
  },
  components: {
    RouterLink
  },
};
</script>

<template>
  <div class="contentArea">
    <div class="questionTitle">這是問卷標題</div>
    <div class="questionContent">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima ipsa,
      porro aliquam odit illo reiciendis possimus mollitia repudiandae?
      Accusamus quo totam temporibus necessitatibus? Ipsa qui quam ut iure
      adipisci perspiciatis.
    </div>
    <p class="data">姓名：</p>
    <p class="data">手機：</p>
    <p class="data">E-mail：</p>
    <p class="data">年齡：</p>
    <p class="data">1.這是第一個問題題目(單選)：</p>
    <p class="data">這是第一個問題答案</p>
    <p class="data">2.這是第二個問題題目(複選)：</p>
    <p class="data">這是第二個問題答案</p>
    <p class="data">3.這是第三個問題題目：</p>
  </div>
</template>

<style scoped lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  background-color: transparent;
}
.contentArea {
  width: 70dvw;
  height: 155dvh;
  margin: 0 auto;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 3%;
  background-color: white;
  padding: 2%;
  border: 0px;
  position: relative;
  .save {
    position: absolute;
    bottom: 5%;
    right: 19%;
    height: 3%;
    width: 6%;
    border: 2px solid black;
    &:hover{
        cursor: pointer;
    }
    &:active{
        cursor: pointer;
        background-color: gray;
    }
  }
  .publish{
    position: absolute;
    bottom: 5%;
    right: 6%;
    width: 9%;
    height: 3%;
    background: black;
    color: white;
    border: 0px;
    &:hover{
        cursor: pointer;
    }
    &:active{
        cursor: pointer;
        background-color: gray;
    }
  }
}
.questionTitle {
  text-align: center;
  font-size: 2em;
  margin-bottom: 3%;
}
.questionContent {
  margin-bottom: 3%;
  font-size: 1.2em;
}
.data {
  font-size: 1.3em;
  margin-bottom: 3%;
}
.radio {
  margin-right: 2%;
  margin-bottom: 3%;
}
</style>
