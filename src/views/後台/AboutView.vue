<script>
import Swal from "sweetalert2";
import { RouterLink, RouterView } from "vue-router";
import "echarts";

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
  created() {
    // 預設日期為當日 +1
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    this.quiz.start_date = currentDate.toISOString().split("T")[0];
    this.quiz.end_date = currentDate.toISOString().split("T")[0];
  },
  computed: {
    minDate() {
      const dtToday = new Date();
      const month = (dtToday.getMonth() + 1).toString().padStart(2, "0");
      const day = (dtToday.getDate() + 1).toString().padStart(2, "0");
      const year = dtToday.getFullYear();
      return `${year}-${month}-${day}`;
    },
  },
  components: {
    RouterLink,
    // Alert,
  },
  methods: {
    addRow() {
      console.log(this.question);
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
        is_published: this.quiz.is_published,
      };
      console.log(obj);
      console.log(this.question);

      // === 必填欄位防呆機制 ===
      if (
        this.quiz.name === "" ||
        this.quiz.description === "" ||
        this.quiz.start_date === "" ||
        this.quiz.end_date === ""
      ) {
        Swal.fire({
          icon:"warning",background:"white",
          title:"Oops...",background:"white",
          text:"問題名稱、問題說明、開始時間、結束時間皆為必填欄位"
        })
        // alert("問題名稱、問題說明、開始時間、結束時間皆為必填欄位");
        return;
      } else if (this.question.title === "") {
        Swal.fire({
          icon:"warning",background:"white",
          title:"Oops...",background:"white",
          text:"問題為必填欄位"
        })
        // alert("問題為必填欄位");
        return;
      } else if (this.question.type === "") {
        alert("問題類型為必填欄位");
        return;
      } else if (this.quiz.start_date > this.quiz.end_date){
        alert("開始日期不能晚於結束日期")
        return;
      }

      // === 判斷當下是編輯還是新增 ===
      // selectedIndex 是從調用 editInput 方法而來，因此若沒有調用該方法(沒按編輯鈕)，selectedIndex 為預設值 null
      if (this.selectedIndex !== null) {
        // 不是null => 有調用方法 => 編輯模式
        this.quiz.question_list[this.selectedIndex] = obj; // 撈出該筆資料，並將新的obj傳入
        this.selectedIndex = null;
      } else {
        // this.selectedIndex == null =>為預設值，沒調用方法 => 新增模式
        this.quiz.question_list.push(obj);
        this.question.id += 1;
      }
      console.log(this.quiz.question_list);
      console.log(obj2);

      // === 問卷id重整 ===
      // array        .reduce ((accumulator,currentValue) => {     箭頭函式     }  , accumulator的預設值)
      // currentValue 是指陣列中每個元素，reduce會遍歷陣列，並重複以currentValue去執行箭頭函式，單次執行後結果放入暫存容器(accumulator)裡，
      // 全部執行後即會變成單一資料
      // question_list.reduce ((max        , item)        => Math.max(max.item.id) ,  0)
      // max是容器，item是question_list中元素，找出item.id的最大值後放入max，最終可知道該陣列的最大id為何
      const maxId = this.quiz.question_list.reduce(
        (max, item) => Math.max(max, item.id),
        0
      );
      // 新增問卷的最新id是目前id最大 + 1 (如果沒有此條件，會讓id以上一筆編輯的id+1，而不是最新的id)
      this.question.id = maxId + 1;
      this.question = {
        id: this.question.id,
        title: "",
        options: "",
        type: "",
        is_necessary: false,
      };
    },
    publish() {
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
        is_published: this.quiz.is_published,
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
    editInput(index) {
      // index 表示該題目在整份問卷的索引位置
      this.question = { ...this.quiz.question_list[index] };
      this.selectedIndex = index;
      console.log(this.question);
      console.log(this.selectedIndex);
      // console.log(`進入編輯: ${this.quiz.question_list[index].title}`)
    },
    deleteQuestion() {
      this.quiz.question_list = this.quiz.question_list.filter(
        (item, index) => !this.deleteCheckbox.includes(item.id)
      );
      console.log("刪除後的question_list", this.quiz.question_list);

      this.quiz.question_list.forEach((item, index) => {
        item.id = index + 1;
      });

      console.log("重新編號", this.quiz.question_list);
      this.deleteCheckbox = [];
      this.question.id = this.quiz.question_list.length + 1;
    },
    
  },
};

// statistics() {
//   let staObj = {
//     quizId: 1,
//   };
//   fetch("http://localhost:8080/quiz/statistics", {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(staObj),
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//     });
// },
//   },
// };
</script>

<template>
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
        @click="statistics()"
        style="right: -43.5%"
      />
    </label>
  </div>

  <div class="quesionaire" v-show="this.changeShow == 'A'">
    <div class="quebox middleArea">
      <div class="questionaire">
        <span class="name que">*問卷名稱：</span>
        <label for="name"></label>
        <input
          id="name"
          class="titlename input"
          type="text"
          style="width: 62%"
          v-model="this.quiz.name"
        />
        <span class="name que">*問卷說明：</span>
        <input
          class="titlename input"
          type="text"
          style="width: 62%; height: 7%"
          v-model="this.quiz.description"
        />
        <span class="time que">*開始時間：</span>
        <input
          class="start input"
          type="date"
          style="width: 20%; margin-right: 6%"
          v-model="this.quiz.start_date"
          required
          :min="minDate"
        />
        <span class="time que">*結束時間：</span>
        <input
          class="end input"
          type="date"
          style="width: 19%"
          v-model="this.quiz.end_date"
          required
          :min="minDate"
        />
        <!-- <RouterLink to="/"><button class="cancel">取消</button></RouterLink>
      <label for="ask">下一步</label> -->
        <div class="line"></div>
        <div class="askArea" style="margin-top: 1%;">
          <span class="name que" style="margin-top: 6%">*問題：</span>
          <input
            class="title input"
            type="text"
            name=""
            id=""
            style="width: 50%; margin-right: 5%"
            v-model="this.question.title"
          />
          <select name="" id="" class="select" v-model="this.question.type">*
            <option value="">- 問題類型 -</option>
            <option value="單選題">單選題</option>
            <option value="複選題">複選題</option>
            <option value="敘述題">敘述題</option>
          </select>
          <input
            type="checkbox"
            name=""
            id=""
            class="necessary"
            v-model="this.question.is_necessary"
          />
          <span class="neceText">必填</span>
          <span class="name que">&nbsp;&nbsp;選項：</span>
          <span class="name que">（多個答案請以；分隔）</span>
          <textarea
            class="multi input"
            name=""
            id=""
            cols="30"
            rows="10"
            style="width: 66%; height: 33%; margin-top: 1%"
            v-model="this.question.options"
          ></textarea>
          <button type="submit" class="add" @click="this.addRow()">加入</button>
          <!-- <alert v-if="this.ctrlModal" @alertModel="this.addRow()">
            <template v-slot=header>
              <p>!!</p>
            </template>
          </alert> -->
          <button type="submit" @click="deleteQuestion()" style="border: 0px;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <table class="askTable">
            <thead>
              <th scope="col" class="thead">勾選</th>
              <th scope="col" class="thead">編號</th>
              <th scope="col" class="thead">內容</th>
              <th scope="col" class="thead">問題種類</th>
              <th scope="col" class="thead">必填</th>
              <th scope="col" class="thead">編輯</th>
            </thead>
            <tbody>
              <tr
                class="content"
                v-for="(item, index) in this.quiz.question_list"
                :key="index"
              >
                <td>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    v-model="this.deleteCheckbox"
                    :value="item.id"
                  />
                </td>
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.type }}</td>
                <td>
                  <input type="checkbox" v-model="item.is_necessary" disabled />
                </td>
                <td>
                  <button class="edit" @click="editInput(index)">
                    <i
                      class="fa-solid fa-pen-to-square"
                      style="background-color: transparent"
                    ></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- <label for="questionaire">上一步</label> -->
          <RouterLink to="/"><button class="cancel">上一步</button></RouterLink>
          <label for="preview" class="input-wrapper">
            <input
              type="radio"
              class="toPre next"
              v-model="changeShow"
              value="B"
              name="preview"
              style="right: 13.8%;bottom: 5%;"
            />
            <span class="prebtn" style="right: 14.8%;bottom: 5.6%;">下一步</span>
          </label>
          <!-- <button class="next" value="B">問卷預覽</button> -->
        </div>
      </div>
      <!-- <button class="cancel">取消</button> -->
    </div>
  </div>
  <div class="preview" v-show="this.changeShow == 'B'" >
    <div class="preview middleArea">
      <div class="preArea">
        <div class="time">{{this.quiz.start_date}} - {{this.quiz.end_date}}</div>
        <div class="questionTitle">{{this.quiz.name}}</div>
        <div class="questionContent">
          {{this.quiz.description}}
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
        <div class="questionList" v-for="item in this.quiz.question_list" style="display: flex;">
          <span style="background-color: transparent;">{{ item.id }}.</span> &nbsp;  
          <div style="background-color: transparent;"><p class="data" style="background-color: transparent;">{{ item.title }}</p></div><br>
          <div class="optionArea">
          <div class="" v-for="eachOpt in item.options.split(';')" style="background-color: transparent;width: 40%;">
          <label for=""  class="radio" v-if="item.type === '單選題' ">
            <input type="radio" class="radio"   name="single"style="margin-right: 10px;"/>{{ eachOpt }}
          </label>
        
          <label for=""  class="radio" v-if="item.type === '複選題' ">
            <input type="checkBox" class="radio" name="more" style="margin-right: 10px;" />{{ eachOpt }} 
          </label>
          <label for=""  class="radio" v-if="item.type === '敘述題' ">
            <textarea name="" id="" cols="30" rows="10" style="background-color: transparent;resize: none;width: 150%;height: 74%;":disabled></textarea>
          </label>
        </div>
        </div>
        
        </div>
        <!-- <RouterLink to="/"><button class="cancel">上一步</button></RouterLink>  -->
        <label for="backA">
            <input
              type="radio"
              class="toEdit next"
              v-model="changeShow"
              value="A"
              name="backA"
              style="bottom: 5%;right: 28.5%;"
            />
            <span class="prebtn" style="bottom: 5.5%;right: 29.3%;">上一步</span>
          </label>
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
  </div>
  <div class="feedback" v-show="this.changeShow == 'C'">
    <div class="fbbox middleArea">
      <table class="fbTable">
        <thead>
          <th scope="col" class="thead">編號</th>
          <th scope="col" class="thead">姓名</th>
          <th scope="col" class="thead">填寫時間</th>
          <th scope="col" class="thead">觀看回覆</th>
        </thead>
        <tbody>
          <tr class="content">
            <td>#1</td>
            <td>王曉明</td>
            <td>2024/06/01 00:00</td>
            <td><button>前往</button></td>
          </tr>
          <tr class="content">
            <td>#2</td>
            <td>abc</td>
            <td>2024/01/01 00:00</td>
            <td>前往</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="statistic" v-show="this.changeShow == 'D'">
    <div class="stabox middleArea">
      <div class="staArea">
        <span class="time">2024/06/01~2024/12/31</span>
        <span class="questionTitle">這是問卷標題</span>
        <div class="q1logo quelogo">Q</div>
        <div class="qu1title quetitle">第一題題目</div>
        <div class="question1 outcome">
          <div class="circle1 circle">
            <v-chart class="chart" :option="option" />
          </div>
          <div class="queana1 analyze">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste
            dolorem necessitatibus dolores. Architecto soluta nesciunt eaque!
            Eos dolore aperiam debitis assumenda provident, commodi accusamus
            quae veniam ipsam tenetur. Vitae, nihil!
          </div>
        </div>

        <div class="q2logo quelogo">Q</div>
        <div class="qu2title quetitle">第二題題目</div>
        <div class="question2 outcome">
          <div class="circle2 circle"></div>
          <div class="queana2 analyze">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla vel
            quae ipsam sed animi recusandae ea, tempore deserunt. Harum expedita
            facilis neque ipsam ipsum deserunt molestiae inventore, non
            veritatis ullam.
          </div>
        </div>
      </div>
    </div>
  </div>
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
  display: none;
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
  height: 155dvh;
}
//---
.askbox {
  height: 120dvh;
}
.fbbox {
  height: 100dvh;
}
.stabox {
  height: 190dvh;
}
.middleArea {
  background-color: rgb(240, 240, 240);
  border-right: 5px solid rgb(50 50 50 / 95%);
  border-bottom: 5px solid rgb(50 50 50 / 95%);
  position: absolute;
  width: 79dvw;
  top: 34%;
  left: 9%;
  .questionaire {
    width: 80%;
    height: 55%;
    // border: 1px solid black;
    margin: 2% 12%;
    display: flex;
    flex-wrap: wrap;
    background-color: transparent;
    justify-content: left;
    align-items: center;
    padding-left: 7%;
    .que {
      background-color: transparent;
      font-size: 1.3em;
      margin-right: 3%;
      margin-top: 4%;
      font-weight: 600;
    }
    .input {
      background-color: transparent;
      width: 46%;
      height: 7%;
      border: 1px solid black;
      margin-right: 9%;
      margin-top: 5%;
      border-radius: 5px;
      padding-left: 9px;
      padding-right: 6px;
    }
  }
  .cancel {
    position: absolute;
    bottom: 5%;
    right: 24%;
    background-color: #80808061;
    border: 0px;
    width: 6%;
    height: 3%;
    &:hover {
      cursor: pointer;
    }
    &:active {
      cursor: pointer;
      background-color: rgb(71, 71, 71);
      color: #ffffff;
    }
  }
  .next {
    -webkit-appearance: none;
    position: absolute;
    bottom: 5%;
    right: 15.5%;
    background-color: black;
    color: #ffffff;
    border: 0px;
    width: 6%;
    height: 3%;
    &:hover {
      cursor: pointer;
    }
    &:active {
      cursor: pointer;
      background-color: rgb(183, 183, 183);
      color: #000000;
    }
  }
  // .input-wrapper{
  //   position: relative;
  // }
  // .toEdit{
  //   position: absolute;
  //   opacity: 0;
  //   right: 13.8%;
  //   bottom: 5%;
  //   width: 100%;
  //   height: 100%;
  //   cursor: pointer;

  // }
  
 
  .question {
    height: 90dvh;
  }
  .line {
    width: 90%;
    height: 0%;
    border: 1px dashed gray;
    position: absolute;
    left: 5%;
    top: 32%;
  }
  .askArea {
    width: 100%;
    height: 50%;
    // border: 1px solid black;
    margin: -2% -7%;
    display: flex;
    flex-wrap: wrap;
    background-color: transparent;
    justify-content: left;
    align-items: center;
    padding-left: 7%;
    .que {
      background-color: transparent;
      font-size: 1.3em;
      margin-right: 3%;
      margin-top: 4%;
      font-weight: 600;
    }
    .input {
      background-color: transparent;
      border: 1px solid black;
      margin-right: 9%;
      margin-top: 5%;
      border-radius: 5px;
    }
    .title {
      width: 46%;
      height: 14%;
    }
    .multi {
      width: 67%;
      height: 34%;
      margin-top: -6%;
      margin-left: 13.5%;
      word-wrap: break-word;
      resize: none;
    }
    .select {
      padding: 0%;
      margin-top: 5%;
      margin-right: 3%;
      width: 14%;
      height: 11%;
      font-size: 0.8em;
      background: transparent;
    }
    .necessary {
      margin-top: 4%;
      width: 6%;
      height: 6%;
    }
    .neceText {
      margin-top: 3.5%;
      background: transparent;
    }
    .add {
      width: 7%;
      height: 13%;
      border: 0px;
      background: #1a1919a8;
      color: white;
      margin-left: -2%;
      &:hover {
        cursor: pointer;
      }
      &:active {
        cursor: pointer;
        background-color: #000000;
      }
    }
    .fa-trash-can {
      position: absolute;
      bottom: 40%;
      left: 21%;
      font-size: 1.5em;
      background: transparent;
      &:hover{
        cursor: pointer;
        color: #a6a6a6;
      }
      &:active{
        cursor: pointer;
      }
    }
    .askTable {
      border-collapse: collapse;
      // position: absolute;
      // bottom: 11%;
      // left: 19%;
      width: 94%;
      // height: 31%;
      text-align: center;
      margin-top: 9%;
    }
    .thead {
      background-color: #a6a6a6;
      padding: 1%;
    }
    td {
      padding: 5px;
    }
    .edit {
      background-color: transparent;
      border: 0px;
      &:hover {
        cursor: pointer;
      }
      &:active {
        cursor: pointer;
      }
    }
  }
  .prebtn {
    font-size: 14px;
    color: white;
    z-index: 99;
    position: absolute;
    bottom: 5.7%;
    background: transparent;
    right: 16.3%;
    &:hover {
      cursor: pointer;
    }
    &:active {
      cursor: pointer;
    }
    
  }
  // ===
  .preArea {
    background-color: transparent;
    height: 160dvh;
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
    width: 60%;
    background-color: transparent;
      }
    }
    .save {
      position: absolute;
      bottom: 5%;
      right: 19%;
      height: 3%;
      width: 6%;
      border: 0px;
      background: #b7b7b7;
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
  .staArea {
    background-color: transparent;
    .time {
      background-color: transparent;
      position: absolute;
      top: 4%;
      right: 4%;
    }
    .questionTitle {
      width: 28%;
      font-size: 2.5em;
      background: transparent;
      position: absolute;
      top: 5%;
      left: 38%;
    }
    .outcome {
      background-color: white;
      width: 73%;
      height: 33%;
      position: absolute;
    }
    .question1 {
      top: 15%;
      left: 12.5%;
    }
    .question2 {
      bottom: 9%;
      left: 13%;
    }
    .quelogo {
      width: 8%;
      height: 6.5%;
      font-size: 3.3em;
      text-align: center;
      align-items: center;
      position: absolute;
      background: lightgray;
      border-left: 4px solid;
      color: dimgray;
      font-family: sans-serif;
      padding-top: 3px;
      z-index: 1;
    }
    .q1logo {
      top: 11.5%;
      left: 10%;
    }
    .q2logo {
      top: 54%;
      left: 10%;
    }
    .quetitle {
      position: absolute;
      font-size: 1.5em;
      width: 71%;
      border: 0px;
      background: lightgray;
      height: 3.5%;
      padding-left: 24px;
      padding-top: 2px;
      z-index: 1;
    }
    .qu1title {
      top: 13%;
      left: 17%;
    }
    .qu2title {
      bottom: 41%;
      left: 17%;
    }
    .circle {
      background-color: #a6a6a6;
      border-radius: 50%;
    }
    .analyze {
      background-color: transparent;
      border: 1px solid black;
      height: 56%;
      width: 30%;
      position: absolute;
    }
    .chart{
      height: 400px;
    }
    .queana1 {
      top: 22%;
      right: 10%;
    }
    .queana2 {
      bottom: 19%;
      left: 10%;
    }
  }
}
</style>
