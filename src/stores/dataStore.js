import { defineStore } from "pinia";

export default defineStore('dataStore',{
    state: () => ({  // 存放全域變數的地方
        dataObj:{},
        quizId:0,
        editObj:{},
        fillinObj:{},
        feedbackObj:{},
        personObj:{},
        staObj:{},
    }),
    getters:{  // 返回變數或數據
      getDataObj:(state) => state.dataObj,
      getQuizId:(state) => state.quizId,
      geteditObj:(state) => state.editObj,
      getFeedbackObj:(state) => state.feedbackObj,
      getPersonObj:(state) => state.personObj,
      getStaObj:(state) => state.staObj,
    
    },
    actions:{   // 處理數據
        setQuizObj(obj){
            this.dataObj = obj
        },
        setQuizId(id){
            this.quizId = id
        },
        setEditObj(obj){
            this.editObj = obj
        },
        setFillinObj(obj){
            this.fillinObj = obj
        },
        setFeedbackObj(obj){
            this.feedbackObj = obj
        },
        setPersonObj(obj){
            this.personObj = obj
        },
        setStaObj(obj){
            this.staObj = obj
        },
        }
    }
)