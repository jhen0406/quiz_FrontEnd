<script>
import { RouterLink, RouterView } from "vue-router";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      fillquiz: {
        quiz_id: 1,
        name: "",
        phone: "",
        email: "",
        age: null,
        fillin_list: [],
      },
      fillin: {
        question_id: 1,
        question: "",
        options: "",
        answer: "",
        type: "",
        necessary: true,
      },
    };
  },
  components: {
    RouterLink,
  },
  computed: {
    ...mapState(dataStore, ["editObj", "fillinObj", "personObj"]),
  },
  mounted() {
    console.log("pinia裡的editObj", this.editObj);
    console.log("pinia裡的fillintObj", this.fillinObj);
    console.log("pinia裡的personObj", this.personObj);
  },
  methods: {
    // ...mapActions(dataStore, ["setFillinObj"]),
    goToPre() {
      this.$emit("next", "A");
    },
    
    success() {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "問卷填寫完成",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
};
</script>

<template>
  <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css" rel="stylesheet">
  <div class="contentArea">
    <div class="questionTitle">{{ this.personObj.quizName }}</div>
    <div class="questionContent">
      {{ this.personObj.feedbackDetail.description }}
    </div>
    <div class="personal">
      <span class="data">姓名：</span>
      <input
        type="text"
        class="text"
        v-model="this.personObj.userName"
        disabled
      />
      <br />
      <span class="data">手機：</span>
      <input
        type="text"
        class="text"
        v-model="this.personObj.feedbackDetail.phone"
        disabled
      /><br />
      <span class="data">E-mail：</span>
      <input
        type="text"
        class="text"
        v-model="this.personObj.feedbackDetail.email"
        style="margin-left: -24px"
        disabled
      /><br />
      <span class="data">年齡：</span>
      <input
        type="text"
        class="text"
        v-model="this.personObj.feedbackDetail.age"
        disabled
      /><br />
    </div>
    <div
      class="questionArea"
      v-for="(item, index) in this.personObj.feedbackDetail.fillinList"
      :key="item.question_id"
    >
      <div class="titleId">
        <span style="background-color: transparent; font-size: 1.2em"
          >{{ index + 1 }}.</span
        >
        &nbsp;
        <p class="data" style="background-color: transparent">
          {{ item.question }}
        </p>
        <div class="necessary" v-if="item.necessary === true">必填</div>
        <br />
      </div>
      <div class="optionArea">
        <div
          class=""
          v-for="(eachOpt, optIndex) in item.options.split(';')"
          :key="optIndex"
          style="background-color: transparent; width: 65%; margin-right: 25px"
        >
          <label for="" class="radio" v-if="item.type === '單選'">
            <input
              type="radio"
              class="radio"
              name="single"
              style="margin-right: 10px"
              v-model="item.answer"
              disabled
              :value="eachOpt"
            />{{ eachOpt }}
          </label>
          <label for="" class="radio" v-if="item.type === '多選'">
            <input
              type="checkBox"
              class="radio"
              name="more"
              style="margin-right: 10px"
              :checked="item.answer.includes(eachOpt)"
              disabled
              :value="eachOpt"
            />{{ eachOpt }}
          </label>
          <label for="" class="radio" v-if="item.type === '文字'">
            <textarea
              name=""
              id=""
              cols="30"
              rows="10"
              style="
                background-color: transparent;
                resize: none;
                width: 150%;
                height: 74%;
              "
              v-model="item.answer"
              disabled
            ></textarea>
          </label>
        </div>
      </div>
    </div>
    <RouterLink to="/FrontHome"
      ><button class="save" style="right: 23%">取消</button></RouterLink
    >
    <!-- <RouterLink to="/"><button class="save">僅儲存</button></RouterLink> -->
    <RouterLink to="/Statistics"
      ><button
        type="submit"
        class="publish"
        @click="
          // this.success();
          this.showAns();
          this.sentToDB();
          this.success();
          
        "
      >
        送出
      </button></RouterLink
    >
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
  height: 161dvh;
  margin: 0 auto;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8%;
  background-color: rgb(240, 240, 240);
  padding: 3% 6% 24% 6%;
  border: 0px;
  position: relative;
  .save {
    position: absolute;
    bottom: 5%;
    right: 19%;
    height: 3%;
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
.questionTitle {
  text-align: center;
  font-size: 2em;
  margin-bottom: 3%;
}
.questionContent {
  margin-bottom: 3%;
  font-size: 1.2em;
  text-align: center;
}
.personal {
  margin-bottom: 3%;
}
.titleId {
  display: flex;
  height: 21px;
}
.data {
  font-size: 1.3em;
  margin-bottom: 3%;
  margin-right: 7%;
  margin-top: -2px;
  margin-left: 9px;
  position: relative;
}
.necessary {
  background-color: #ff00008a;
  color: white;
  width: 3%;
  height: 2%;
  font-size: 11px;
  text-align: center;
  position: absolute;
  left: 21%;
}
.radio {
  margin-right: 2%;
  margin-bottom: 3%;
}
.text {
  border: 0px;
  border-bottom: 1.5px solid black;
  margin-bottom: 21px;
  height: 29px;
  width: 40%;
}
.optionArea {
  display: flex;
  width: 67%;
  padding-left: 4%;
  margin-top: 3%;
  margin-bottom: 21px;
}
</style>
