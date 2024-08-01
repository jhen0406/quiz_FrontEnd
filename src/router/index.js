import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/後台/HomeView.vue";
import ManageTest from "../views/後台/ManageTest.vue";
import AddAndEdit from "@/components/AddAndEdit.vue";
import Preview from "@/components/Preview.vue";
import Feedback from "@/components/Feedback.vue";
import Statistics from "@/components/Statistics.vue";

const router = createRouter(
  {
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: "/",
        name: "home",
        component: HomeView,
      },
      {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/後台/AboutView.vue"),
      },
      {
        path: "/totalList",
        name: "/totalList",
        component: () => import("../views/前台/TotalList.vue"),
      },
      {
        path: "/FeedbackCheck",
        name: "FeedbackCheck",
        component: () => import("../views/後台/FeedbackCheck.vue"),
      },
      {
        path: "/Fillinpage",
        name: "Fillinpage",
        component: () => import("../components/FillinPage.vue"),
      },
      {
        path: "/ManageTest",
        name: "ManageTest",
        component: ManageTest,
      },
      {
        path: "/AddAndEdit",
        name: "AddAndEdit",
        component: AddAndEdit,
      },
      {
        path: "/Preview",
        name: "Preview",
        component: Preview,
      },
      {
        path: "/Feedback",
        name: "Feedback",
        component: Feedback,
      },
      {
        path: "/Statistics",
        name: "Statistics",
        component: Statistics,
      },
      {
        path: "/FrontHome",
        name: "FrontHome",
        component: () => import("../views/前台/FrontHome.vue"),
      },
      {
        path: "/FrontFillin",
        name: "FrontFillin",
        component: () => import("../views/前台/FrontFillin.vue"),
      },
      {
        path: "/PersonalFillin",
        name: "PersonalFillin",
        component: () => import("../views/後台/PersonalFillin.vue"),
      }
    ],
  },

  
);

export default router;
