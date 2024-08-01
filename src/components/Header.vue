<script>
import { RouterLink, RouterView } from "vue-router";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
export default {
  // 在 template 當標籤使用的方法或元件
  components: {
    RouterLink,
  },

};
</script>

<template>
  <div class="headerArea">
    <h1 class="title">客製化問卷平台</h1>
    <div class="router">
      <RouterLink class="questionList routerItem" to="/">問卷列表 |</RouterLink>
      <RouterLink class="addQuestion routerItem" to="/ManageTest" 
        >問卷管理 |</RouterLink
      >
      <RouterLink class="toFront routerItem" to="/FrontHome" 
        >前台管理列表</RouterLink
      >
      <!-- <RouterLink to="/ManageTest">about</RouterLink>   -->
      <!-- <RouterLink  to="/CheckPage">確認頁</RouterLink> -->
      <!-- <RouterLink  to="/FeedbackCheck">問卷回饋確認頁</RouterLink> -->
      <!-- <RouterLink  to="/FillinPage">前台輸入頁</RouterLink> -->
      <!-- <button type="button" @click="test()">tsetObj</button> -->
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@200..900&display=swap");
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: #d2d8d0;
  font-family: "Noto Serif TC", serif;
}
.headerArea {
  width: 98dvw;
  height: 15dvh;
  background-color: rgb(50 50 50 / 95%);
  /* border-radius: 0px 0px px 36px; */
  position: relative;
  .title {
    background-color: transparent;
    color: #d2d8d0;
    width: 26%;
    margin-top: 0px;
    padding-top: 1%;
    padding-left: 3%;
    border-bottom-style: groove;
    padding-bottom: 0.5%;
  }
  .router {
    position: absolute;
    right: 27%;
    bottom: 23%;
    background-color: transparent;
    width: 35%;
  }
  .routerItem {
    background-color: transparent;
    color: white;
    font-size: 24px;
    margin: 0 1%;
    text-decoration: none;
    text-align: center;
    &:checked {
      font-weight: 600;
    }
  }
  .selectPage{
    background-color: aquamarine;
  }
}
</style>
