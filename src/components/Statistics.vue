<script>
import { RouterLink, RouterView } from "vue-router";
import dataStore from "@/stores/dataStore";
import { mapState, mapActions } from "pinia";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, defineComponent } from "vue";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default defineComponent({
  name: "HelloWorld",
  components: {
    VChart,
  },
  computed: {
    ...mapState(dataStore, ["staObj"]),
  },
  created() {
    console.log("pinia裡的staObj", this.staObj);
  },
  provide: {
    [THEME_KEY]: "transparent",
  },
  setup() {
    const option = ref({
      title: {
        text: "純茶類",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"],
      },
      series: [
        {
          name: "Traffic Sources",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [
            { value: 2, name: "烏龍" },
            { value: 0, name: "青茶" },
            { value: 1, name: "綠茶" },
            { value: 1, name: "紅茶" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });

    return { option };
  },
});
</script>

<template>
  <div class="stabox middleArea">
    <div class="staArea">
      <span class="time">2024/06/08~2024/06/30</span>
      <span class="questionTitle">中午要喝啥</span>
      <div class="q1logo quelogo">Q</div>
      <div class="qu1title quetitle">純茶類</div>
      <div class="question1 outcome">
        <v-chart class="chart" :option="option" autoresize />
      </div>

      <div class="q2logo quelogo">Q</div>
      <div class="qu2title quetitle">拿鐵類</div>
      <div class="question2 outcome">
        <v-chart class="chart" :option="option" autoresize />
      
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
    .chart {
      height: 88vh;
      width: 65%;
    }
    .analyze {
      background-color: transparent;
      border: 1px solid black;
      height: 56%;
      width: 30%;
      position: absolute;
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
  canvas{
    position: absolute;
    left: 186px;
    top: 45px;
    width: 75%;
    height: 75%;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    padding: 0px;
    margin: 0px;
    border-width: 0px;
  }
}
</style>
