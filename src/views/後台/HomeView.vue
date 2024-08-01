<script>
import { RouterLink, RouterView } from "vue-router";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";


export default {
  data() {
    return {
      addQuest: "A",
      quizList: [],
      deleteCheckbox: [],
      // state:"",
      currentPage: 1, // 搜尋結果當前頁數
      itemsPerPage: 10, // 搜尋結果每頁顯示筆數
    };
  },
  computed: {
    ...mapState(dataStore,['dataObj','feedbackObj']),
    totalpages() {
      // 計算搜尋結果總頁數
      return Math.ceil(this.quizList.length / this.itemsPerPage);
    },
    calData() {
      console.log('開始要算分頁的資料',this.quizList)
      // 資料分頁
      // 起始索引位置 : 當前頁數1，共 10筆，因此當頁資料起始位置為0，第一頁的資料為0-10筆
      const startPage = (this.currentPage - 1) * this.itemsPerPage;
      const endPage = startPage + this.itemsPerPage;
      // slice : 從 quizList 中提取從 startPage 到 endPage 的數據，但不包含 endPage
      // console.log('quizList',this.quizList)
      return this.quizList.slice(startPage, endPage);
    },
    calPages() {
      // 動態生成頁碼
      let pages = []; // 將全部頁碼變成一個陣列
      const total = this.totalpages;
      // 從 1 遍歷到總頁數，生成對應的頁碼
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    },
    calDataWithStatus() {
      // 根據開始和結束日期判斷狀態
      const pageData = this.calData; // 將分頁後的資料傳入
      console.log('pageData',pageData)
      const now = new Date();
      return pageData.map((item) => {
        //  遍歷全部資料
        console.log(item.start_date)
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const publish = item.published;
        // console.log(start_date)
        let status = "";
        if (publish === true && now < startDate) {
          status = "尚未開始";
        } else if (publish === true && now >= startDate && now < endDate) {
          status = "開放中";
        } else if (publish === false) {
          status = "未發佈";
        } else {
          status = "已結束";
        } return {
          ...item,
          status, // 展開item陣列中所有元素，並新增 status 元素
        };
      });
    },
  },
  components: {
    RouterLink,
  },
  created() {
    this.search();
  },
  methods: {
    ...mapActions(dataStore, ['setEditObj','setFeedbackObj']),
    search() {
      let searchObj = {
        name: this.quizList.name,
        start_date: this.quizList.start_date,
        end_date: this.quizList.end_date,
        publish: this.quizList.published,
      };
      // url
      fetch("http://localhost:8080/quiz/search", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // console.log(data.quizList[0].start_date);
          this.quizList = data.quizList;
          // console.log(data.quizList.id)
        });
      if (this.quizList.start_date > this.quizList.end_date) {
        alert("開始日期不能晚於結束日期");
        return;
      }
    },
    nextPage() {
      // 下一頁
      // 如果當前頁數比總頁數小，當前頁數 + 1 (翻到下一頁)
      if (this.currentPage < this.totalpages) {
        this.currentPage++;
      }
    },
    prevPage() {
      // 上一頁
      // 如果當前頁數不是1，當前頁數 - 1 (翻到前一頁)
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    changePage(page) {
      // 跳轉到指定頁
      this.currentPage = page;
    },
    deleteQuiz() {
      // 刪除問卷
      let deleteObj = {
        id_list: this.deleteCheckbox, // 被勾選的問卷形成新編號列表
      };
      console.log(deleteObj);
      if (this.deleteCheckbox.length > 0 ) {
        this.quizList = this.quizList.filter(
          // 扣除被勾選的問卷成為新的問卷陣列
          (item) => !this.deleteCheckbox.includes(item.id)
        );
        console.log(this.quizList);
        fetch("http://localhost:8080/quiz/delete", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deleteObj),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            alert("已刪除問卷");
          })
          .catch((error) => {
            console.error("error", error);
            alert("發生錯誤，請稍後重試");
            return;
          });
      } else {
        alert("請勾選欲刪除的問卷");
      }
      this.deleteCheckbox = [];
    },
    getStatusClass(status) {
      switch (status) {
        case "開放中":
          return "status-open";
        case "已結束":
          return "status-end";
        case "未發佈":
          return "status-unpublished";
        case "尚未開始":
          return "status-unstart";
        default:
          return "";
      }
    },
    bringToInput(index){
      this.selectedIndex = index
      console.log('選的問卷',this.calData[index])
      // toEdit = this.calData[selectedIndex]
      this.setEditObj(this.calData[index])
      // this.quiz = {...this.quiz[index]};
      // this.selectedIndex = index;
      // console.log('選的問卷',this.quiz);
      // console.log('選的問卷index',this.selectedIndex)
    },
    clear(){
      this.setEditObj('')
    },
    goToFeedback(){
      this.$router.push('/Feedback');
    },
    

  },
};
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <div class="search">
    <div class="searchTitle title">篩選</div>
    <h6 class="name que">問卷名稱：</h6>
    <input class="titlename input" type="text" v-model="this.quizList.name" />
    <h6 class="time que">統計時間：</h6>
    <input class="start input" type="date" v-model="this.quizList.start_date" />
    <h6 class="to que">到</h6>
    <input class="end input" type="date" v-model="this.quizList.end_date" />
    <button class="searchbtn" type="button" @click="search()">搜尋</button>
  </div>
  <div class="list">
    <button class="deleteBtn" type="submit" @click="deleteQuiz()">
      <i class="fa-solid fa-trash-can"></i>
    </button>
    <RouterLink to="/ManageTest" @click="clear()"><i class="fa-solid fa-plus"></i></RouterLink>
    <div class="listTitle title">問卷列表</div>
    <table class="questionaire">
      <thead>
        <th scope="col" class="thead">勾選</th>
        <th scope="col" class="thead">問卷編號</th>
        <th scope="col" class="thead">問卷名稱</th>
        <th scope="col" class="thead">狀態</th>
        <th scope="col" class="thead">開始時間</th>
        <th scope="col" class="thead">結束時間</th>
        <th scope="col" class="thead">結果</th>
      </thead>
      <tbody>
        <tr class="content" v-for="(item, index) in this.calDataWithStatus">
          <td>
            <input
              type="checkbox"
              v-model="deleteCheckbox"
              :value="item.id"
              :disabled="item.status === '開放中'"
            />
          </td>
          <td>{{ item.id }}</td>
          <td>
            <RouterLink to="/ManageTest" style="background-color: transparent;" @click="this.bringToInput(index)"><button class="questionTitleBtn" @click="this.bringToInput(index)" :disabled="item.status === '開放中' || item.status === '已結束'">{{ item.name }}</button></RouterLink>
          </td>
          <td>
            <div class="statusB g" :class="getStatusClass(item.status)">
              {{ item.status }}
            </div>
          </td>
          <td>{{ item.startDate }}</td>
          <td>{{ item.endDate }}</td>
          <td>
            <button
              class="edit"
              :disabled="item.status === '尚未開始' || item.status === '未發佈'"
              @click="this.goToFeedback();this.bringToInput(index)"
            >
              <i 
                class="fa-solid fa-forward"
                style="background-color: transparent"
              ></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="changePage">
      <!-- 上一頁和下一頁按鈕： :disabled 表示在當前頁數 === 特定位置時禁用(不能按) -->
      <button
        class="prevpage page"
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        <
      </button>
      <button
        v-for="page in calPages"
        :key="page"
        class="otherPages"
        @click="changePage(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <button
        class="nextpage page"
        @click="nextPage"
        :disabled="currentPage === totalpages"
      >
        >
      </button>
    </div>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: #dcdcdc;
}
.search {
  background-color: rgb(240, 240, 240);
  width: 70dvw;
  height: 35dvh;
  margin: 57px auto;
  border-left: 5px solid rgb(50 50 50 / 95%);
  position: relative;
  .searchTitle {
    width: 79px;
    height: 44px;
    background: rgb(50 50 50 / 95%);
    color: white;
    font-weight: 500;
    font-size: 1.3em;
    position: absolute;
    top: -9%;
    left: 3%;
    text-align: center;
    padding-top: 6px;
  }
  .que {
    font-size: 1.3em;
    background-color: transparent;
    color: rgb(0 0 0 / 95%);
  }
  .name {
    position: absolute;
    top: 26%;
    left: 18%;
  }
  .time {
    position: absolute;
    top: 60%;
    left: 18%;
  }
  .input {
    border-radius: 5px;
    border: 1px solid #000000;
    background-color: transparent;
    position: absolute;
  }
  .titlename {
    top: 26%;
    left: 31%;
    height: 17%;
    width: 49%;
  }
  .start {
    top: 60%;
    left: 31%;
    height: 16%;
    width: 19%;
  }
  .to {
    position: absolute;
    top: 60%;
    left: 54%;
  }
  .end {
    top: 60%;
    right: 20%;
    height: 17%;
    width: 19%;
  }
  .searchbtn {
    position: absolute;
    width: 8%;
    height: 14%;
    bottom: 12%;
    right: 6%;
    background-color: #000000;
    color: white;
    border: 0px;
    &:hover {
      cursor: pointer;
      background-color: #b6b6b6;
    }
    &:active {
      background-color: #000000;
      cursor: pointer;
    }
  }
}
.deleteBtn {
  color: #000000;
  &:hover {
    cursor: pointer;
    color: #9d9999;
  }
  &:active {
    cursor: pointer;
    color: #000000;
  }
  color: #000000;
  position: absolute;
  top: 10%;
  left: 10%;
  font-size: 1em;
  border: 0px;
}
.list {
  background-color: rgb(240, 240, 240);
  width: 70dvw;
  height: 100dvh;
  margin: 57px auto;
  border-right: 5px solid rgb(50 50 50 / 95%);
  position: relative;
  .fa-plus {
    color: #000000;
    &:hover {
      cursor: pointer;
      color: #9d9999;
    }
    &:active {
      cursor: pointer;
      color: #000000;
    }
    .fa-trash-can {
      color: #000000;
      position: absolute;
      top: 10%;
      left: 10%;
      font-size: 1.5em;
      background-color: transparent;
      &:hover {
        cursor: pointer;
      }
      &:active {
        cursor: pointer;
      }
    }
  }
  .listTitle {
    width: 132px;
    height: 44px;
    background: rgb(50 50 50 / 95%);
    color: white;
    font-weight: 500;
    font-size: 1.3em;
    position: absolute;
    top: -5%;
    left: 3%;
    text-align: center;
    padding-top: 6px;
  }
  .fa-trash-can {
    position: absolute;
    top: 10%;
    left: 10%;
    font-size: 1.5em;
    background-color: transparent;
  }
  .fa-plus {
    position: absolute;
    top: 10%;
    left: 6%;
    font-size: 1.5em;
    background-color: transparent;
  }
  .questionaire {
    border-collapse: collapse;
    position: absolute;
    top: 20%;
    left: 2.5%;
    width: 96%;
    background-color: #cdc6a5;
  }
  .thead {
    background-color: #a6a6a6;
    border: white;
    padding: 1%;
  }
  .content {
    text-align: center;
  }
}
td {
  background-color: #ffffffbd;
  padding: 5px;
}
tr:nth-of-type(odd) td {
  background-color: #d9d9d973;
}
.status-dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  border: 0px;
  margin-right: 5px;
}
.statusBg {
  width: 64px;
  height: 23px;
  border-radius: 10px;
  margin: auto auto;
  vertical-align: middle;
  font-size: 14px;
}
.status-unpublished {
  background-color: #aaa2a2ad;
}
.status-unstart {
  background-color: #8999eeab;
}
.status-open {
  background-color: #aee161b8;
}
.status-end {
  background-color: #e77f7fb8;
}
.edit {
  border: 0px;
  background-color: transparent;
  &:hover {
    cursor: pointer;
    color: #a6a6a6;
  }
  &:active {
    cursor: pointer;
  }
}
.questionTitleBtn {
  border: 0px;
  font-size: medium;
  background-color: transparent;
  &:hover {
    cursor: pointer;
    color: #a6a6a6;
  }
  &:active {
    cursor: pointer;
  }
}
button:disabled {
  color: #9d9999;
  &:hover {
    cursor: not-allowed;
  }
}
input:disabled {
  &:hover {
    cursor: not-allowed;
  }
}
.changePage {
  width: 33%;
  height: 6%;
  background-color: transparent;
  // border: 1px solid black;
  position: absolute;
  /* margin: 60% auto; */
  bottom: 3%;
  left: 32%;
  display: flex;
  justify-content: space-evenly;
}
.page {
  position: absolute;
  color: black;
  font-weight: 700;
  border: 0px;
  font-size: 1.3em;
  background: transparent;
  &:hover {
    cursor: pointer;
    color: #aeaaaa;
  }
  &:active {
    cursor: pointer;
    color: #dcdcdc;
  }
}
.prevpage {
  bottom: 5%;
  left: 0%;
}
.otherPages {
  border: 0px;
  background-color: transparent;
  font-size: 1em;
  &:hover {
    cursor: pointer;
    color: #aeaaaa;
  }
  &:active {
    cursor: pointer;
    color: #dcdcdc;
  }
}
.nextpage {
  bottom: 5%;
  left: 96%;
}
</style>
