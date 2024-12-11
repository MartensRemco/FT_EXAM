import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import EspTestScreen from "../views/espTestScreen.vue";
import RouteTestScreen from "../views/routeTestScreen.vue";
import MediaPipeScreen from "../views/mediaPipeScreen.vue";
import HomeScreen from "../views/homeScreen.vue";
import gameTwoPlayersScreen from "../views/gameTwoPlayersScreen.vue";
import gameTwoPlayerRoundOneScreen from "../views/gameTwoPlayersRoundOneScreen.vue";
import gameTwoPlayerRoundTwoScreen from "../views/gameTwoPlayersRoundTwoScreen.vue";
import gameTwoPlayerRoundThreeScreen from "../views/gameTwoPlayersRoundThreeScreen.vue";

// Define routes
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => HomeScreen,
  },
  {
    path: "/esp",
    name: "esp",
    component: EspTestScreen,
  },
  {
    path: "/test",
    name: "test",
    component: RouteTestScreen,
  },
  {
    path: "/mediapipe",
    name: "mediapipe",
    component: MediaPipeScreen,
  },
  {
    path: "/circles",
    name: "circles",
    component: () => import("../views/circleGame.vue"),
  },
  {
    path: "/game2",
    name: "game2",
    component: gameTwoPlayersScreen,
  },
  {
<<<<<<< HEAD
    path: "/breathtest/:player",
    name: "breathtest",
    component: () => import("../views/breathTestScreen.vue"),
  },
  {
    path: "/sober/:player",
    name: "sober",
    component: () => import("../views/soberScreen.vue"),
  },
  {
    path: "/intoxicated/:player",
    name: "intoxicated",
    component: () => import("../views/intoxicatedScreen.vue"),
=======
    path: "/roundOne",
    name: "roundOne",
    component: gameTwoPlayerRoundOneScreen,
  },
  {
    path: "/roundTwo",
    name: "roundTwo",
    component: gameTwoPlayerRoundTwoScreen,
  },
  {
    path: "/roundThree",
    name: "roundThree",
    component: gameTwoPlayerRoundThreeScreen,
>>>>>>> origin/main
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use import.meta.env.BASE_URL instead
  routes,
});

export default router;
