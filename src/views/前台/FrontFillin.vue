<script>
import { RouterLink, RouterView } from "vue-router";
import FillinPage from "../../components/FillinPage.vue";
import CheckPage from "../../components/CheckPage.vue";
import Statistics from "@/components/Statistics.vue";

export default {
  data() {
    return {
      changeShow: "A",
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
  components: {
    RouterLink,
    FillinPage,
    CheckPage,
    Statistics
  },
  methods: {
    changeStep(step) {
      console.log("Received next-step event with step:", step);
      this.changeShow = step;
    },
    
  },
  mounted() {

  },
};
</script>

<template>
  <!-- 頁籤區 -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <div class="pageTitle">
    <label for="questionaire" class="ques label">
      <span class="quespan span">填寫問卷</span>
      <input
        class="titleInput"
        id="questionaire"
        type="radio"
        v-model="this.changeShow"
        value="A"
        name="questionaire"
        style="width: 15%;top: 3%;left: 6%;"
      />
    </label>
    <label for="preview" class="pre label">
      <span class="prespan span">問卷預覽</span>
      <input
        class="titleInput"
        id="preview"
        type="radio"
        v-model="this.changeShow"
        value="B"
        name="preview"
        style="left: 10%;top: 3%;width: 15%;"
      />
    </label>
    <label for="statistic" class="statistic label">
      <span class="staspan span">觀看統計</span>
      <input
        class="titleInput"
        type="radio"
        id="statistic"
        v-model="this.changeShow"
        value="C"
        name="statistic"
        style="right: -46.8%;top: 3%;width: 15%;"
      />
    </label>
  </div>
  <FillinPage
    v-if="changeShow === 'A'"
    :quiz="quiz"
    :minDate="minDate"
    @next="changeStep"
  ></FillinPage> 
  <CheckPage v-if="changeShow === 'B'" :quiz="quiz" @next="changeStep"></CheckPage>
  <Statistics v-if="changeShow === 'C'" :quiz="quiz" @next="changeStep" ></Statistics>
</template>

<style scoped lang="scss">
.pageTitle {
  height: 13dvh;
  margin: 5% auto;
  width: 76%;
  font-size: 2em;
  letter-spacing: 4px;
}
.label {
  &:checked {
    font-weight: 600;
  }
}
.titleInput {
  -webkit-appearance: none;
  background-color: rgb(240, 240, 240);
  color: white;
  margin-right: 0%;
  padding: 10px;
  height: 8dvh;
  width: 13%;
  position: relative;
  &:hover {
    cursor: pointer;
  }
  &:active {
    cursor: pointer;
  }
  &:checked {
    border-top: 3px solid black;
  }
}
.span {
  position: absolute;
  background: transparent;
  z-index: 99;
  font-size: 0.7em;
  top: 28%;
  &:hover {
    cursor: pointer;
  }
  &:active {
    cursor: pointer;
  }
  &:checked {
    color: #ffffff;
  }
}
.quespan {
  // top: 29%;
  left: 18.5%;
  width: 9%;
}
.prespan {
  // top: 29%;
  left: 32.7%;
}
.fbspan {
  // top: 29%;
  right: 25.5%;
}
.staspan {
  // top: 29%;
  right: 19.5%;
}
.quebox {
  height: 210dvh;
}
</style>
