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
    ...mapState(dataStore, ["editObj", "fillinObj"]),
  },
  mounted() {
    console.log("pinia裡的editObj", this.editObj);
    console.log("pinia裡的fillintObj", this.fillinObj);
  },
  methods: {
    ...mapActions(dataStore, ["setFillinObj"]),
    goToPre() {
      this.$emit("next", "A");
    },
    success() {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    showAns() {
      const transformData = {
        quiz_id: parseInt(this.fillinObj.quiz_id),
        name: this.fillinObj.name,
        phone: this.fillinObj.phone,
        email: this.fillinObj.email,
        age: this.fillinObj.age,
        fillin_list: this.editObj.question_list.map((question) => {
          const answerObj = this.fillinObj.fillin_list;
          let answer = "";
          if (question.type === "多選") {
            const answerKeys = Object.keys(answerObj).filter((key) =>
              key.startsWith(`${question.id}_`)
            );
            const answerChoices = answerKeys
              .map((key) => (answerObj[key] ? key.split("_")[1] : null))
              .filter((item) => item);
            const optionsArray = question.options.split(";");
            answer = answerChoices
              .map((choice) => optionsArray[parseInt(choice)])
              .join(";");

            console.log("多選 keys", answerKeys);
            console.log("多選 choices", answerChoices);
            console.log("多選 answer", answer);
          } else {
            answer = answerObj[question.id];
            console.log("單選/文字 answer", answer);
          }
          return {
            question_id: parseInt(question.id),
            question: question.title,
            options: question.options,
            answer: answer,
            type: question.type,
            necessary: question.is_necessary,
          };
        }),
      };
      console.log("transformData", transformData);
      return transformData;
      
    },
    sentToDB() {
      const fillinFin = this.showAns();
      fetch("http://localhost:8080/quiz/fillin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fillinFin),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "問卷填寫完成",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
  },
};
</script>

<template>
  <div class="contentArea">
    <div class="questionTitle">{{ this.editObj.name }}</div>
    <div class="questionContent">
      {{ this.editObj.description }}
    </div>
    <div class="personal">
      <span class="data">姓名：</span>
      <input type="text" class="text" v-model="this.fillinObj.name" disabled />
      <br />
      <span class="data">手機：</span>
      <input
        type="text"
        class="text"
        v-model="this.fillinObj.phone"
        disabled
      /><br />
      <span class="data">E-mail：</span>
      <input
        type="text"
        class="text"
        v-model="this.fillinObj.email"
        style="margin-left: -24px"
        disabled
      /><br />
      <span class="data">年齡：</span>
      <input
        type="text"
        class="text"
        v-model="this.fillinObj.age"
        disabled
      /><br />
    </div>
    <div class="questionArea" v-for="item in this.editObj.question_list">
      <div class="titleId">
        <span style="background-color: transparent; font-size: 1.2em"
          >{{ item.id }}.</span
        >
        &nbsp;
        <p class="data" style="background-color: transparent">
          {{ item.title }}
        </p>
        <div class="necessary" v-if="item.is_necessary === true">必填</div>
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
              :checked="this.fillinObj.fillin_list[item.id] == eachOpt"
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
              :checked="this.fillinObj.fillin_list[item.id + '_' + optIndex]"
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
              :value="this.fillinObj.fillin_list[item.id]"
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
    <RouterLink to="/FrontHome"
      ><button
        type="submit"
        class="publish"
        @click="
          // this.success();
          this.showAns();
          this.sentToDB();
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
  height: 155dvh;
  margin: 0 auto;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: -7%;
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
