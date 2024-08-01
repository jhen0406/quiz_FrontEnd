<script>
import { RouterLink, RouterView } from "vue-router";
import { computed } from "vue";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";

export default {
  data() {
    return {
        quiz: {
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        question_list: [],
        is_published: true,
      },
      question: {
        id: 1,
        title: "",
        options: "",
        type: "",
        is_necessary: false,
      },
    };
  },
  components: {
    RouterLink,
  },
  props:{
    quiz : Object,
    question : Object,
  },
  computed:{
    ...mapState(dataStore,['dataObj']),
  },
  created(){
    console.log('新增的問卷',this.dataObj)
    console.log(this.dataObj.question_list)
  },
  methods:{
    publish() {
      let obj = {
        // 問卷的題目
        id: this.question.id,
        title: this.question.title,
        options: this.question.options,
        type: this.question.type,
        is_necessary: this.question.is_necessary,
      };
      obj = this.dataObj.question_list
      let obj2 = {
        // 問卷
        name: this.dataObj.name,
        description: this.dataObj.description,
        start_date: this.dataObj.start_date,
        end_date: this.dataObj.end_date,
        question_list: this.dataObj.question_list,
        is_published: this.dataObj.is_published,
      };
      obj2 = this.dataObj
      console.log(this.dataObj.question_list);
      // this.quiz.question_list.push(obj);
      console.log(this.dataObj);
      // console.log(obj2);
      this.question.id += 1;
      this.question.title = "";
      this.question.options = "";
      this.question.type = "";
      console.log('送出前',this.dataObj)
      this.dataObj.start_date = this.dataObj.startDate
      this.dataObj.end_date = this.dataObj.endDate
      fetch("http://localhost:8080/quiz/create_update", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj2),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    },
    unpublish() {
      let obj = {
        // 問卷的題目
        id: this.question.id,
        title: this.question.title,
        options: this.question.options,
        type: this.question.type,
        is_necessary: this.question.is_necessary,
      };
      let obj2 = {
        // 問卷
        name: this.quiz.name,
        description: this.quiz.description,
        start_date: this.quiz.start_date,
        end_date: this.quiz.end_date,
        question_list: this.quiz.question_list,
        is_published: !this.quiz.is_published,
      };
      console.log(obj);
      // this.quiz.question_list.push(obj);
      console.log(this.quiz.question_list);
      console.log(obj2);
      this.question.id += 1;
      this.question.title = "";
      this.question.options = "";
      this.question.type = "";
      fetch("http://localhost:8080/quiz/create_update", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj2),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    },
    goToAdd(){
      this.$emit('next','A')
    },
   
  }
};
</script>

<template>
  <div class="preview middleArea">
    <div class="preArea">
      <div class="time">{{this.dataObj.startDate}} - {{this.dataObj.endDate}}</div>
      <div class="questionTitle">{{ this.dataObj.name }}</div>
      <div class="questionContent">
        {{this.dataObj.description}}
      </div>
      <div class="personal">
        <span class="data personSpan">姓名：</span>
        <div class="name text"></div>
        <br />
        <span class="data personSpan">手機：</span>
        <div class="phone text"></div>
        <br />
        <span class="data personSpan">E-mail：</span>
        <div class="email text"></div>
        <br />
        <span class="data personSpan">年齡：</span>
        <div class="age text"></div>
        <br />
      </div>
      <div class="questionList" v-for="item in this.dataObj.question_list" style="display: flex;">
          <span style="background-color: transparent;">{{ item.id }}.</span> &nbsp;  
          <div style="background-color: transparent;"><p class="data" style="background-color: transparent;">{{ item.title }}</p></div><br>
          <div class="optionArea">
          <div class="" v-for="(eachOpt,optIndex) in item.options.split(';')" :key="optIndex" style="background-color: transparent;width: 40%;">
          <label for=""  class="radio" v-if="item.type === '單選' ">
            <input type="radio" class="radio"   name="single"style="margin-right: 10px;" disabled/>{{ eachOpt }}
          </label>
          <label for=""  class="radio" v-if="item.type === '多選' ">
            <input type="checkBox" class="radio" name="more" style="margin-right: 10px;" disabled/>{{ eachOpt }} 
          </label>
          <label for=""  class="radio" v-if="item.type === '文字' ">
            <textarea name="" id="" cols="30" rows="10" style="background-color: transparent;resize: none;width: 150%;height: 74%; border: 1px solid black;" disabled></textarea>
          </label>
        </div>
        </div>
        </div>
        <button class="save" @click="this.goToAdd()" style="right: 29%;">上一步</button>
      <RouterLink to="/"
        ><button class="save" @click="unpublish()">僅儲存</button></RouterLink
      >
      <RouterLink to="/"
        ><button class="publish" type="button" @click="publish()">
          儲存並發布
        </button></RouterLink
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.askbox {
  height: 120dvh;
}
.middleArea {
  background-color: rgb(240, 240, 240);
  border-right: 5px solid rgb(50 50 50 / 95%);
  border-bottom: 5px solid rgb(50 50 50 / 95%);
  position: absolute;
  width: 79dvw;
  top: 35%;
  left: 9%;
  .preArea {
    background-color: transparent;
    height: 175dvh;
    position: relative;
    .time {
      background: transparent;
      width: 26%;
      top: -1%;
      position: absolute;
      right: 1%;
    }
    .questionTitle {
      background: transparent;
      font-size: 2em;
      margin: 5% auto;
      width: 60%;
      margin-bottom: 2%;
    }
    .questionContent {
      width: 80%;
      background: transparent;
      margin: 3% auto;
    }
    .personal {
      background: transparent;
      width: 50%;
      font-size: 1.2em;
      margin-top: 3%;
      margin-left: 10%;
      .personSpan {
        background: transparent;
      }
      .text {
        width: 59%;
        height: 0dvh;
        border: 1px solid gray;
        margin-bottom: 3%;
      }
    }
    .questionList {
      background-color: transparent;
      width: 65%;
      height: 18dvh;
      font-size: 1.2em;
      margin-left: 10%;
      display: flex;
      position: relative;
      .data {
        background-color: transparent;
        margin-bottom: 3%;
        letter-spacing: 2px;
      }
      .radio {
        background-color: transparent;
        margin-right: 2%;
        margin-bottom: 3%;
      }
      .textinput {
        width: 70%;
        height: 25%;
        border: 1px solid black;
        margin-left: 4%;
        background-color: transparent;
      }
      .optionArea{
        display: flex;
    position: absolute;
    top: 37%;
    left: 3%;
    width: 80%;
    background-color: transparent;
      }
    }
    .save {
      position: absolute;
      bottom: 5%;
      right: 19%;
      height: 3%;
      width: 6%;
      border: 0px solid black;
      &:hover {
        cursor: pointer;
      }
      &:active {
        cursor: pointer;
        background-color: gray;
      }
    }
    .publish {
      position: absolute;
      bottom: 5%;
      right: 6%;
      width: 9%;
      height: 3%;
      background: black;
      color: white;
      border: 0px;
      &:hover {
        cursor: pointer;
      }
      &:active {
        cursor: pointer;
        background-color: gray;
      }
    }
  }
  .fbTable {
    border-collapse: collapse;
    position: absolute;
    top: 18%;
    left: 15%;
    width: 70%;
    .thead {
      background-color: #a6a6a6;
      padding: 4px;
    }
    .content {
      text-align: center;
    }
  }
}
</style>
