import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import productDetails from "../views/productDetails.vue";
import UserProfile from "../views/userProfile.vue";
import ChatView from "../views/chatView.vue";
import FavouriteView from "../views/favouriteView.vue";
import mainComponent from "../views/posts/addPost.vue";
import RegionSelector from "../components/addpost/citiesComponent.vue";
import CitySelector from "../components/addpost/metacityComponents.vue";
import citiesComponent from "@/components/addpost/citiesComponent.vue";
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
    path: "/profile/:userId",
    name: "userProfile",
    component: UserProfile
  },
  {
    path: "/chat",
    name: "chat",
    component: ChatView,
  },
  {
    path: "/favourites",
    name: "favourites",
    component: FavouriteView,
  },
  {
    path:'/add-offer',
    name: "addOffer",
    component: mainComponent
  },
  {
    path:"/region",
    name: "region",
    component: RegionSelector
  },
  {
    path: "/city",
    name: "citiy",
    component: CitySelector
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
