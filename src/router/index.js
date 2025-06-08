import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import productDetails from "../views/productDetails.vue";
import UserProfile from "../views/userProfile.vue";
import ChatView from "../views/chatView.vue";
import FavouriteView from "../views/favouriteView.vue";
import mainComponent from "../views/posts/addPost.vue";
import RegionSelector from "../components/addpost/citiesComponent.vue";
import CitySelector from "../components/addpost/metacityComponents.vue";
import postData from "../views/posts/postData.vue";
import SaleOrRent from "../views/posts/Buildings and lands/chooseRentOrSale.vue";
import typesOfbuildings from "../views/posts/Buildings and lands/typesOfbuildings.vue";
import AddBuildingsSpecificData from "../views/posts/Buildings and lands/addBuildingsSpecificData.vue";
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
  },
  {
    path: '/add-data',
    name: "addData",
    component: postData
  },
  {
    path: '/saleorrent',
    name: "SaleOrRent",
    component: SaleOrRent
  },
  {
    path: "/typesOfbuildings",
    name: "typesOfbuildings",
    component: typesOfbuildings,
    props: (route) => ({ saleState: route.query.saleState })
  },
  {
    path: '/AddBuildingsSpecificData',
    name: "AddBuildingsSpecificData",
    component: AddBuildingsSpecificData,
    props: (route) => ({ type: route.query.type })

  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
