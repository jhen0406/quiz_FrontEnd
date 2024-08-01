<script>
import { RouterLink, RouterView } from "vue-router";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import Swal from "sweetalert2";
import { color } from "echarts";

export default {
  name: 'AddAndEdit',
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
  created() {
        // 預設日期為當日 +1
        console.log('created',this.quiz)
    const currentDate = new Date();
    const currentDate1 = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate1.setDate(currentDate1.getDate() + 2);
    this.quiz.start_date = currentDate.toISOString().split("T")[0];
    this.quiz.end_date = currentDate1.toISOString().split("T")[0];
  },
  beforeMount(){
    console.log('beforeMount',this.quiz)
  },
mounted(){
  console.log('pinia裡的editObj',this.editObj)
  console.log('mounted',this.quiz)
    if(this.editObj){
      this.quiz = this.editObj;
      this.quiz.start_date = this.editObj.startDate
      this.quiz.end_date = this.editObj.endDate
      // console.log('quiz.questions',this.quiz.questions)
      // console.log('editObj.questions',this.editObj.questions)
      if(this.editObj.questions){
        try{
          this.quiz.question_list = JSON.parse(this.editObj.questions);
          console.log(this.quiz.question_list)
        }
        catch(e){
          console.error('報錯了',e)
          this.quiz.question_list = []
        }
      } else{
        this.quiz.question_list = []
      }
      
    }
},
updated(){
  console.log('updated',this.quiz)
},
  computed:{
    ...mapState(dataStore,['dataObj','editObj']),
    
  minDateStart() {
    const dtToday = new Date();
    const month = (dtToday.getMonth() + 1).toString().padStart(2, "0");
    const day = (dtToday.getDate() + 1).toString().padStart(2, "0");
    const year = dtToday.getFullYear();
    return `${year}-${month}-${day}`;
  },
  minDateEnd() {
    const dtToday = new Date();
    const month = (dtToday.getMonth() + 1).toString().padStart(2, "0");
    const day = (dtToday.getDate() + 2).toString().padStart(2, "0");
    const year = dtToday.getFullYear();
    return `${year}-${month}-${day}`;
  },
},
  components: {
    RouterLink,
    // Alert,
  },
  methods: {
    ...mapActions(dataStore, ['setQuizObj','setQuizId']),
    goToPre(){
      this.$emit('next','B')
    },
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
      if (this.quiz.name === "" || this.quiz.description === "" || this.quiz.start_date === "" || this.quiz.end_date === "" ){
        Swal.fire({
          color:"#ffffff",
          icon:"warning",
          title:"Oops...",
          text:"問題名稱、問題說明、開始時間、結束時間皆為必填欄位"
        })
        
        // alert("問題名稱、問題說明、開始時間、結束時間皆為必填欄位")
        return;
      } else if(this.question.title === ""){
        // alert("問題為必填欄位")
        Swal.fire({
          icon:"warning",background:"white",
          title:"Oops...",background:"white",
          text:"問題為必填欄位"
        })
        return;
      } else if(this.question.type === ""){
        alert("問題類型為必填欄位")
        return;
      } 
    
        // === 判斷當下是編輯還是新增 === 
        // selectedIndex 是從調用 editInput 方法而來，因此若沒有調用該方法(沒按編輯鈕)，selectedIndex 為預設值 null
        if (this.selectedIndex !== null) {   // 不是null => 有調用方法 => 編輯模式
          this.quiz.question_list[this.selectedIndex] = obj;  // 撈出該筆資料，並將新的obj傳入
          this.selectedIndex = null;
        } else {  // this.selectedIndex == null =>為預設值，沒調用方法 => 新增模式
          const maxId = this.quiz.question_list.reduce(
        (max, item) => Math.max(max, item.id),
        0
      );
      obj.id = maxId + 1;
          this.quiz.question_list.push(obj);
          // this.question.id += 1;
        }
      console.log(this.quiz.question_list);
      console.log(this.quiz)
      

      // === 問卷id重整 ===
      // array        .reduce ((accumulator,currentValue) => {     箭頭函式     }  , accumulator的預設值)
      // currentValue 是指陣列中每個元素，reduce會遍歷陣列，並重複以currentValue去執行箭頭函式，單次執行後結果放入暫存容器(accumulator)裡，
      // 全部執行後即會變成單一資料
      // question_list.reduce ((max        , item)        => Math.max(max.item.id) ,  0)
      // max是容器，item是question_list中元素，找出item.id的最大值後放入max，最終可知道該陣列的最大id為何
      
      // 新增問卷的最新id是目前id最大 + 1 (如果沒有此條件，會讓id以上一筆編輯的id+1，而不是最新的id)
      this.question = {
        id: this.quiz.question_list.length > 0 ? this.quiz.question_list.reduce(
        (max, item) => Math.max(max, item.id),
        0
      ) + 1 : 1,
        title: "",
        options: "",
        type: "",
        is_necessary: false,
      };
    },
    editInput(index) {  // index 表示該題目在整份問卷的索引位置
      this.question = { ...this.quiz.question_list[index] };
      this.selectedIndex = index;
      console.log(this.question);
      console.log(this.selectedIndex);
      // console.log(`進入編輯: ${this.quiz.question_list[index].title}`)
    },
    deleteQuestion(){
      this.quiz.question_list = this.quiz.question_list.filter(
        (item,index) => !this.deleteCheckbox.includes(item.id)
      );
      console.log("刪除後的question_list",this.quiz.question_list)

      this.quiz.question_list.forEach((item,index) => {
        item.id = index + 1
      });

      console.log("重新編號",this.quiz.question_list)
      this.deleteCheckbox = [];
      this.question.id = this.quiz.question_list.length + 1
      
      
    },
    saveToNext(){
      console.log('送出前最後資料',this.quiz);
      this.setQuizObj(this.quiz)
      console.log('存值後',this.dataObj)
    },

   
  },
};
</script>

<template>
<div class="quesionaire">
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
          :placeholder="editObj.name || 'Enter name'"
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
          v-model="this.quiz.startDate"
          required
          :min="minDateStart"
        />
        <span class="time que">*結束時間：</span>
        <input
          class="end input"
          type="date"
          style="width: 19%"
          v-model="this.quiz.endDate"
          required
          :min="minDateEnd"
        />
        <!-- <RouterLink to="/"><button class="cancel">取消</button></RouterLink>
      <label for="ask">下一步</label> -->
        <div class="line"></div>
        <div class="askArea" style="margin-top: 1%;">
          <span class="name que" style="margin-top: 6%">問題：</span>
          <input
            class="title input"
            type="text"
            name=""
            id=""
            style="width: 50%; margin-right: 5%"
            v-model="this.question.title"
          />
          <select
            name=""
            id=""
            class="select"
            v-model="this.question.type"
          >
            <option value="">- 問題類型 -</option>
            <option value="單選">單選題</option>
            <option value="多選">複選題</option>
            <option value="敘述">敘述題</option>
          </select>
          <input
            type="checkbox"
            name=""
            id=""
            class="necessary"
            v-model="this.question.is_necessary"
          />
          <span class="neceText">必填</span>
          <span class="name que">選項：</span>
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
          <button type="submit" @click="deleteQuestion()" style="border: 0px;"><i class="fa-solid fa-trash-can"></i></button>
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
                <td><input type="checkbox" name="" id="" v-model="this.deleteCheckbox" :value="item.id"/></td>
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
          <button class="next" @click="saveToNext();this.goToPre()" style="width: 7%;">問卷預覽</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.quebox {
  height: 155dvh;
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
}

</style>
