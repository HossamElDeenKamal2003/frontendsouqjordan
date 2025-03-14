import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import productDetails from "../views/productDetails.vue";
import profileComponent from "../views/profileComponent.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/details/:id",
    name: "details",
    component: productDetails
  },
  {
    path: '/profile',
    name: "profileComponent",
    component: profileComponent
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
