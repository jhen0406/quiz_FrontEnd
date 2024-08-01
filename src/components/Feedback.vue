<script>
import { RouterLink, RouterView } from "vue-router";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";

export default {
  name: 'Feedback',
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
      ctrlModal: true,
      selectedIndex: null,
      deleteCheckbox: [],
    };
  },
  props:{
    quiz : Object,
    question: Object,
    minDate : String,
  },
  created(){
    console.log('選的問卷',this.editObj)
    this.showFeedback()
  },
  computed:{
    ...mapState(dataStore,['editObj','feedbackObj','personObj','staObj']),
  },
  methods:{
    ...mapActions(dataStore, ['setFeedbackObj','setPersonObj','setStaObj']),
    showFeedback(){
      let feedbackId = this.editObj.id
      fetch("http://localhost:8080/quiz/feedback", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackId),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            this.setFeedbackObj(data.feedbackList)
            console.log('pinia里的回饋',this.feedbackObj)
          })
    },
    toPerFeedback(index){
      this.selectedIndex = index
      console.log('個人回饋',this.feedbackObj[index])
      this.setPersonObj(this.feedbackObj[index])
    },
    goToPre(){
      this.$emit('next','D')
    },
    sentTosta(){
      let quizId = this.editObj.id
      fetch("http://localhost:8080/quiz/statistics", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quizId),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            this.setStaObj(data);
            console.log('pinia里的統計',this.staObj)
          })
          
    }
  }
}
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
<div class="fbbox middleArea">
  <div class="title">{{ this.editObj.name }}</div>
  <div class="time">開放時間：{{this.editObj.startDate}} - {{ this.editObj.endDate }}</div>
      <table class="fbTable">
        <thead>
          <th scope="col" class="thead">編號</th>
          <th scope="col" class="thead">姓名</th>
          <th scope="col" class="thead">填寫時間</th>
          <th scope="col" class="thead">觀看回覆</th>
        </thead>
        <tbody>
          <tr class="content" v-for="(item,index) in this.feedbackObj">
            <td>{{ index + 1 }}</td>
            <td>{{item.userName}}</td>
            <td>{{item.fillinDateTime}}</td>
            <td><RouterLink to="/PersonalFillin" style="background-color: transparent;"><button class="edit"><i
                class="fa-solid fa-forward"
                style="background-color: transparent;"
                @click="this.toPerFeedback(index)"
              ></i></button></RouterLink></td>
          </tr>
        </tbody>
      </table>
      <RouterLink to="/"
      ><button class="save" style="right: 23%">返回</button></RouterLink
    >
    <!-- <RouterLink to="/"><button class="save">僅儲存</button></RouterLink> -->
    <button
        type="submit"
        class="publish"
        @click="
          // this.success();
          this.goToPre();
          this.sentTosta()
        "
      >觀看統計
      </button>
    </div>
</template>

<style scoped lang="scss">
.fbbox {
  height: 100dvh;
}
.middleArea {
  background-color: rgb(240, 240, 240);
  border-right: 5px solid rgb(50 50 50 / 95%);
  border-bottom: 5px solid rgb(50 50 50 / 95%);
  position: absolute;
  width: 79dvw;
  top: 34%;
  left: 9%;
  .title{
    background-color: transparent;
    position: absolute;
    top: 11%;
    left: 10%;
    font-size: 2em;
  }
  .time{
    background-color: transparent;
    position: absolute;
    top: 5%;
    right: 5%
  }
  .fbTable {
    border-collapse: collapse;
    position: absolute;
    top: 27%;
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
.edit {
  border: 1px;
  background-color: transparent;
  &:hover {
    cursor: pointer;
    color: #a6a6a6;
  }
  &:active {
    cursor: pointer;
  }
}
.save {
    position: absolute;
    bottom: 5%;
    right: 19%;
    height: 4.5%;
    width: 6%;
    border: 2px solid black;
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
    right: 12%;
    width: 6%;
    height: 4.5%;
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
</style>