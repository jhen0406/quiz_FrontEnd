<script>
import { RouterLink, RouterView } from "vue-router";
import AddAndEdit from "../../components/AddAndEdit.vue";
import Preview from "../../components/Preview.vue";
import Feedback from "../../components/Feedback.vue";
import Statistics from "../../components/Statistics.vue";
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
    AddAndEdit,
    Preview,
    Feedback,
    Statistics,
  },
  methods: {
    changeStep(step) {
      console.log("Received next-step event with step:", step);
      this.changeShow = step;
    },
    callAddAndEdit() {
      if (this.$refs.AddAndEdit) {
        this.startValue = this.$refs.AddAndEdit.minDateStart();
        this.endValue = this.$refs.AddAndEdit.minDateEnd();
      }
    },
  },
  mounted() {
    this.callAddAndEdit();
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
      <span class="quespan span">新增 / 編輯問卷</span>
      <input
        class="titleInput"
        id="questionaire"
        type="radio"
        v-model="this.changeShow"
        value="A"
        name="questionaire"
        style="width: 23%"
      />
    </label>
    <label for="preview" class="pre label">
      <span class="prespan span" style="display: none;">問卷預覽</span>
      <input
        class="titleInput"
        id="preview"
        type="radio"
        v-model="this.changeShow"
        value="B"
        name="preview"
        style="left: 1%;display: none;"
      />
    </label>
    <label for="feedback" class="feedback label">
      <span class="fbspan span">問卷回饋</span>
      <input
        class="titleInput"
        type="radio"
        id="feedback"
        v-model="this.changeShow"
        value="C"
        name="feedback"
        style="right: -44%"
      />
    </label>
    <label for="statistic" class="statistic label">
      <span class="staspan span">統計</span>
      <input
        class="titleInput"
        type="radio"
        id="statistic"
        v-model="this.changeShow"
        value="D"
        name="statistic"
        style="right: -43.5%"
      />
    </label>
  </div>
  <AddAndEdit
    v-if="changeShow === 'A'"
    :quiz="quiz"
    :minDate="minDate"
    @next="changeStep"
  ></AddAndEdit> 
  <Preview v-if="changeShow === 'B'" :quiz="quiz" @next="changeStep"></Preview>
  <Feedback v-if="changeShow === 'C'" :quiz="quiz" @next="changeStep" ></Feedback>
  <Statistics v-if="changeShow === 'D'" :quiz="quiz" @next="changeStep" ></Statistics>
  <router-view></router-view>
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
  margin-right: 3%;
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
  left: 13.5%;
  width: 22%;
}
.prespan {
  // top: 29%;
  left: 33.5%;
}
.fbspan {
  // top: 29%;
  right: 25.5%;
}
.staspan {
  // top: 29%;
  right: 15.5%;
}
.quebox {
  height: 210dvh;
}
</style>
