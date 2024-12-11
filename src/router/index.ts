import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import EspTestScreen from "../views/espTestScreen.vue";
import RouteTestScreen from "../views/routeTestScreen.vue";
import MediaPipeScreen from "../views/mediaPipeScreen.vue";
import HomeScreen from "../views/homeScreen.vue";

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
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use import.meta.env.BASE_URL instead
  routes,
});

export default router;
