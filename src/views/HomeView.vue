<template>
  <div class="parent">
    <!-- Category Filter Component -->
    <CategoryFilterWithImages
        :categories="categories"
        @category-selected="handleCategorySelected"
        class="category-filter"
    />

    <!-- Conditional Rendering of Components Based on Selected Category -->
    <CarsComponent
        v-if="showCarsComponent"
        @car-type-selected="handleCarTypeSelected"
        @model-selected="handleCarModelSelected"
        class="imported-component"
    />
    <BuildingComponent
        v-if="showBuildingComponent"
        @building-type-selected="handleBuildingTypeSelected"
        class="imported-component"
    />
    <DevicesComponent
        v-if="showDevices"
        @device-type-selected="handleDeviceTypeSelected"
        @model-selected="handleDeviceModelSelected"
        class="imported-component"
    />
    <FurnitureComponent
        v-if="showFurnitureComponent"
        @furniture-selected="handleFurnitureSelected"
        class="imported-component"
    />
    <PersonalAccessoriesList
        v-if="showPersonalneeds"
        @need-selected="handleNeedSelected"
        class="imported-component"
    />
    <JobsComponent
        v-if="jobsComponent"
        @job-selected="handleJobSelected"
        class="imported-component"
    />
    <OthersComponent
        v-if="othersComponent"
        @other-selected="handleOtherSelected"
        class="imported-component"
    />


    <!-- Main Layout with Left and Right Sections -->
    <div class="main-container">
      <!-- Left Section: Search and Products -->
      <div class="left-section">
        <!-- Search and Add Offer Section -->
        <div class="search-add-container">
          <input
              type="text"
              placeholder="Search products..."
              v-model="searchQuery"
              :class="['search-input', isDark ? 'dark-search' : '']"
          />
          <button class="add-offer-button">+Add Offer</button>
          <!-- Drawer Toggle Button (Mobile Only) -->
          <button class="drawer-toggle" @click="toggleDrawer" v-if="isMobile">
            {{ drawerOpen ? '✕' : '≡' }}
          </button>
        </div>

        <!-- Products List -->
        <div class="scrollable-container">
          <div class="products-container">
            <router-link
                v-for="(product, index) in filteredProducts"
                :key="product._id"
                :to="{ name: 'details', params: { id: product._id } }"
                :class="[
                'product-card',
                index % 2 === 0 ? 'white-card' : 'grey-card',
                isDark ? 'dark-card' : ''
              ]"
            >
              <img
                  :src="
          product.images && product.images.length
            ? product.images[0]
            : require('../assets/jordan image.jpeg')
        "
                  alt="Product Image"
                  class="product-image"
              />
              <div :class="['product-info', isDark ? 'dark-text' : '']">
                <h3 :class="{ 'seen-title': product.isSeen }">{{ product.title }}</h3>
                <p>{{ product.description }}</p>
                <div class="indicators">
                  <span v-if="product.isSeen" class="seen-indicator">👁️ Seen</span>
                  <span v-if="product.isFavourite" class="favourite-indicator">️❤ Favourite</span>
                </div>
                <div v-if="product.price" class="price">
                  {{ formatPrice(product.price) }}
                </div>
                <div class="time-location">
                  <div class="time-difference">
                    ⏰ {{ formatTimeDifference(product.createdAt) }}
                  </div>
                  <div v-if="product.location" class="location">
                    📍 {{ product.location }}
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div ref="loadMoreTrigger" class="loading-indicator">
            <p v-if="loading">Loading more products...</p>
          </div>
        </div>
      </div>

      <!-- Right Section: Filters (Desktop) / Drawer (Mobile) -->
      <div class="right-section" :class="{ 'drawer-open': drawerOpen && isMobile, 'dark-theme': isDark }">        <!-- Filters Content -->
        <div class="filters-container" :class="{ 'drawer-content': isMobile && drawerOpen }">
          <!-- Close Button in Drawer (Mobile Only) -->
          <button v-if="isMobile && drawerOpen" class="drawer-close" @click="toggleDrawer">
            X
          </button>

          <!-- Location Dropdown -->
          <select v-model="selectedLocation" :class="isDark ? 'darkFilter' : 'lightFilter'" @change="filterProducts" class="filter-dropdown">
            <option value="">All Locations</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>

          <!-- MetaLocation Dropdown -->
          <select v-model="selectedMetaLocation" :class="isDark ? 'darkFilter' : 'lightFilter'" @change="filterProducts" class="filter-dropdown">
            <option value="">All Cities</option>
            <option v-for="metaLoc in metaLocations" :key="metaLoc" :value="metaLoc">
              {{ metaLoc }}
            </option>
          </select>
        </div>
          <!-- Car Type Images -->
          <div class="car-types-container">
            <div
                v-for="(carType, index) in carTypes.slice(0, 10)"
                :key="index"
                class="car-type-item"
                @click="selectCarType(carType)"
            >
              <img :src="carType.image" :alt="carType.name" class="car-type-image" />
              <span>{{ carType.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Fixed Bottom Taskbar -->
      <div :class="['taskbar', { 'dark-mode': isDark }]">
        <div class="taskbar-item" @click="navigateTo('chat')">
          <i class="fas fa-comment"></i>
          <span>Chat</span>
        </div>

        <div class="taskbar-item" @click="navigateTo('favourites')">
          <i class="fas fa-heart"></i>
          <span>Favorites</span>
        </div>
        <div class="taskbar-item" @click="navigateTo('add-offer')">
          <i class="fas fa-plus"></i>
          <span>Add Offer</span>
        </div>
        <div class="taskbar-item" @click="navigateTo('notifications')">
          <i class="fas fa-bell"></i>
          <span>Notifications</span>
        </div>
        <div class="taskbar-item" @click="navigateTo('home')">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import { ConstVariables } from "../../const.js";
import CategoryFilterWithImages from "../components/homeScreenFilter.vue";
import CarsComponent from "../components/cars/carsComponent.vue";
import BuildingComponent from "../components/cars/buildingComponent.vue";
import DevicesComponent from "../components/cars/devicesComponent.vue";
import FurnitureComponent from "../components/cars/furniturreComponent.vue";
import PersonalAccessoriesList from "../components/cars/personalneedsComponent.vue";
import JobsComponent from "../components/cars/jobsComponent.vue";
import OthersComponent from "../components/cars/otherComponent.vue";

export default {
  name: "HomeView",
  components: {
    CategoryFilterWithImages,
    CarsComponent,
    BuildingComponent,
    DevicesComponent,
    FurnitureComponent,
    PersonalAccessoriesList,
    JobsComponent,
    OthersComponent,
  },
  props: {
    isDark: Boolean,
  },
  data() {
    return {
      products: [],
      page: 1,
      limit: 10,
      totalPages: 1,
      loading: false,
      observer: null,
      searchQuery: "",
      selectedCategory: null,
      selectedCarType: null,
      selectedCarModel: null,
      selectedDeviceType: null,
      selectedDeviceModel: null,
      selectedJobType: null,
      selectedOtherType: null,
      selectedNeedType: null,
      selectedBuildingType: null,
      showCarsComponent: false,
      showBuildingComponent: false,
      showDevices: false,
      showPersonalneeds: false,
      showFurnitureComponent: false,
      jobsComponent: false,
      othersComponent: false,
      categories: [],
      filteredItems: {
        category: null,
        metaCategory: null,
        carType: null,
        location: null,
        metaLocation: null,
      },
      selectedLocation: "",
      selectedMetaLocation: "",
      carTypes: [],
      drawerOpen: false,
      isMobile: false,
    };
  },
  computed: {
    filteredProducts() {
      let result = [...this.products];
      console.log("Filtering with:", this.filteredItems); // Debug log for all filters
      if (this.searchQuery) {
        result = result.filter(
            (product) =>
                product.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      if (this.filteredItems.category && this.filteredItems.category !== "all") {
        result = result.filter((product) => product.category === this.filteredItems.category);
      }
      if (this.filteredItems.metaCategory) {
        result = result.filter(
            (product) => product.metaCategory && product.metaCategory.toLowerCase() === this.filteredItems.metaCategory.toLowerCase()
        );
      }
      if (this.filteredItems.carType) {
        result = result.filter(
            (product) =>
                product.carType &&
                product.carType.toLowerCase() === this.filteredItems.carType.toLowerCase()
        );
      }
      if (this.filteredItems.location) {
        result = result.filter(
            (product) =>
                product.location &&
                product.location.toLowerCase() === this.filteredItems.location.toLowerCase()
        );
      }
      if (this.filteredItems.metaLocation) {
        result = result.filter(
            (product) =>
                product.metaLocation &&
                product.metaLocation.toLowerCase() === this.filteredItems.metaLocation.toLowerCase()
        );
      }
      return result;
    },
    locations() {
      return Object.keys(ConstVariables.locationsMap);
    },
    metaLocations() {
      return this.selectedLocation
          ? ConstVariables.locationsMap[this.selectedLocation] || []
          : [];
    },
  },
  created() {
    this.categories = this.getCategories();
    this.loadCarTypes();
    console.log("Component created, initial state:", this.filteredItems); // Debug on create
  },
  mounted() {
    this.getTrips();
    this.$nextTick(this.setupInfiniteScroll);
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
    console.log("Component mounted, initial selectedLocation:", this.selectedLocation, "metaLocation:", this.selectedMetaLocation); // Debug on mount
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    async getTrips() {
      if (this.loading || this.page > this.totalPages) return; // Stop if loading or no more pages
      try {
        this.loading = true;
        const userId = localStorage.getItem("userId") || "null";
        const response = await axios.get(
            `https://backend.jordan-souq.com/product/posts/${userId}?page=${this.page}&limit=${this.limit}`
        );
        const updatedProducts = response.data.products.map((newProduct) => {
          const existingProduct = this.products.find((p) => p._id === newProduct._id);
          if (existingProduct) {
            return {
              ...newProduct,
              isSeen: existingProduct.isSeen,
              isFavourite: existingProduct.isFavourite,
            };
          }
          return newProduct;
        });
        this.products.push(...updatedProducts);
        this.totalPages = response.data.totalPages;
        this.page++; // Increment page for the next load
      } catch (error) {
        console.error("Error fetching trips:", error.message);
      } finally {
        this.loading = false; // Reset loading state
      }
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    async filterProducts() {
      try {
        this.loading = true;
        console.log("Filtering products with:", this.filteredItems); // Debug log before API call
        const userId = localStorage.getItem("userId") || "null";
        let response;
        if (!this.filteredItems.category || this.filteredItems.category === "all") {
          response = await axios.get(
              `https://backend.jordan-souq.com/product/posts/${userId}?page=1&limit=${this.limit}`
          );
        } else {
          response = await axios.post(
              `https://backend.jordan-souq.com/product/filter/${userId}`,
              {
                category: this.filteredItems.category,
                metaCategory: this.filteredItems.metaCategory
                    ? this.filteredItems.metaCategory.toLowerCase()
                    : null,
                carType: this.filteredItems.carType
                    ? this.filteredItems.carType.toLowerCase()
                    : null,
                location: this.filteredItems.location
                    ? this.filteredItems.location.toLowerCase()
                    : null,
                metaLocation: this.filteredItems.metaLocation
                    ? this.filteredItems.metaLocation.toLowerCase()
                    : null,
              }
          );
        }
        const updatedProducts = response.data.products.map((newProduct) => {
          const existingProduct = this.products.find((p) => p._id === newProduct._id);
          if (existingProduct) {
            return {
              ...newProduct,
              isSeen: existingProduct.isSeen,
              isFavourite: existingProduct.isFavourite,
            };
          }
          return newProduct;
        });
        this.products = updatedProducts;
        this.totalPages = response.data.totalPages;
        this.page = 2;
      } catch (error) {
        console.error("Error filtering products:", error);
        alert("Error filtering products");
      } finally {
        this.loading = false;
      }
    },
    setupInfiniteScroll() {
      this.observer = new IntersectionObserver(
          (entries) => {
            console.log("Intersection observed:", entries[0].isIntersecting); // Debug log
            if (entries[0].isIntersecting && !this.loading) {
              this.getTrips();
            }
          },
          { threshold: 0.5 } // Adjust threshold for desktop
      );
      if (this.$refs.loadMoreTrigger) {
        this.observer.observe(this.$refs.loadMoreTrigger);
      }
    },
    handleCategorySelected(categoryName, categoryValue) {
      this.resetComponents();
      this.filteredItems.metaCategory = null;
      this.filteredItems.carType = null;
      if (categoryName === "Cars") {
        this.showCarsComponent = true;
        this.selectedCategory = "Cars";
        this.filteredItems.category = categoryValue;
        this.selectedCarType = ConstVariables.carsTypeList;
      } else if (categoryName === "Building") {
        this.showBuildingComponent = true;
        this.selectedCategory = "Building";
        this.filteredItems.category = categoryValue;
      } else if (categoryName === "Devices") {
        this.showDevices = true;
        this.selectedCategory = "Devices";
        this.filteredItems.category = categoryValue;
      } else if (categoryName === "Furniture") {
        this.showFurnitureComponent = true;
        this.selectedCategory = "Furniture";
        this.filteredItems.category = "others";
        this.filteredItems.metaCategory = "furniture";
      } else if (categoryName === "Personal Needs") {
        this.showPersonalneeds = true;
        this.selectedCategory = "Personal Needs";
        this.filteredItems.category = "others";
        this.filteredItems.metaCategory = "personal accessories";
      } else if (categoryName === "Jobs") {
        this.jobsComponent = true;
        this.selectedCategory = "Jobs";
        this.filteredItems.category = "others";
        this.filteredItems.metaCategory = "jobs";
      } else if (categoryName === "Others") {
        this.othersComponent = true;
        this.selectedCategory = "Others";
        this.filteredItems.category = categoryValue;
      } else if (categoryName === "All") {
        this.selectedCategory = null;
        this.filteredItems.category = "all";
      }
      this.page = 1;
      this.products = [];
      this.filterProducts();
    },
    resetComponents() {
      this.showCarsComponent = false;
      this.showBuildingComponent = false;
      this.showDevices = false;
      this.showFurnitureComponent = false;
      this.showPersonalneeds = false;
      this.jobsComponent = false;
      this.othersComponent = false;
    },
    handleCarTypeSelected(carType) {
      this.selectedCarType = carType;
      this.filteredItems.metaCategory = carType.toLowerCase(); // Set metaCategory for CarsComponent logic
      this.filteredItems.carType = null; // Clear carType to rely on metaCategory for now
      this.filterProducts();
    },
    handleCarModelSelected(model) {
      this.selectedCarModel = model;
      this.filteredItems.carType = model;
      this.filterProducts();
    },
    handleBuildingTypeSelected(buildingType) {
      this.selectedBuildingType = buildingType;
      this.filteredItems.metaCategory = buildingType;
      this.filteredItems.carType = null;
      this.filterProducts();
    },
    handleDeviceTypeSelected(deviceType) {
      this.selectedDeviceType = deviceType;
      this.filteredItems.metaCategory = deviceType;
      this.filteredItems.carType = null;
      this.filterProducts();
    },
    handleDeviceModelSelected(model) {
      this.selectedDeviceModel = model;
      this.filteredItems.carType = model;
      this.filterProducts();
    },
    handleFurnitureSelected(furniture) {
      this.selectedCategory = "Furniture";
      this.filteredItems.carType = furniture;
      this.filterProducts();
    },
    handleNeedSelected(needType) {
      this.selectedNeedType = needType;
      this.filteredItems.carType = needType;
      this.filterProducts();
    },
    handleJobSelected(jobType) {
      this.selectedJobType = jobType;
      this.filteredItems.carType = jobType;
      this.filterProducts();
    },
    handleOtherSelected(otherType) {
      this.selectedOtherType = otherType;
      this.filteredItems.metaCategory = otherType;
      this.filteredItems.carType = null;
      this.filterProducts();
    },
    formatPrice(price) {
      return `$${price}`;
    },
    formatTimeDifference(createdAt) {
      const now = new Date();
      const createdDate = new Date(createdAt);
      const diffInSeconds = Math.floor((now - createdDate) / 1000);
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    },
    getCategories() {
      return [
        { name: "All", image: "https://cdn-icons-png.flaticon.com/512/9696/9696976.png", value: "all" },
        { name: "Cars", value: "سيارات", image: "https://ymimg1.b8cdn.com/uploads/car_model/10543/pictures/12904367/2023_Jetour_Dashing_Plus_Exterior_01.png", category: "Cars" },
        { name: "Building", value: "عقار", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn0dhO9J7R4JT424Qs-RcZqQRkw9tTCbJoxw&s", category: "Building" },
        { name: "Devices", value: "devices", image: "https://st.depositphotos.com/1682899/2107/i/450/depositphotos_21075061-stock-photo-electronic-devices.jpg", category: "Devices" },
        { name: "Furniture", value: "others", image: "https://m.media-amazon.com/images/I/71u3F2NZ9gL.jpg", category: "Furniture" },
        { name: "Personal Needs", value: "others", image: "https://t4.ftcdn.net/jpg/01/86/85/71/360_F_186857190_s4dfc0wfT6jcEcr7e3vzrFuUdysg6Gpp.jpg", category: "Personal Needs" },
        { name: "Jobs", value: "others", image: "https://cdn-icons-png.flaticon.com/512/3850/3850285.png", category: "Jobs" },
        { name: "Others", value: "others", image: "https://cdn-icons-png.flaticon.com/512/91/91356.png", category: "Others" },
      ];
    },
    loadCarTypes() {
      this.carTypes = [
        { name: "Toyota", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdau_-dB7gSut8RS3NiOduk95RplPz2edUFg&s" },
        { name: "Hyundai", image: "https://di-uploads-pod5.dealerinspire.com/triplejsaipan/uploads/2018/05/HyundaiLogoStacked_4cblk-1024x659.gif" },
        { name: "Ford", image: "https://brandlogos.net/wp-content/uploads/2015/01/ford-logo.png" },
        { name: "Kia", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMhP4EuI6IsGTyuuV9CevzTyZW2dNypUW4vQ&s" },
        { name: "Lexus", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Tzcj-HX0yIKXo_HbQvhP0udDlQb1qQ7J3Q&s" },
        { name: "Honda", image: "https://graphicdesignergeeks.com/wp-content/uploads/2024/03/HONDA-1-1080x628.jpg" },
        { name: "Mazda", image: "https://pngimg.com/d/mazda_PNG86.png" },
        { name: "Chevrolet", image: "https://di-uploads-pod2.dealerinspire.com/biggerschevy/uploads/2018/02/2013-Chevrolet-BowTie.jpg" },
        { name: "Nissan", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTApK8B3rNWTU_h5M2Ju5G-0XW6kfKEtfsA-A&s" },
        { name: "Jetour", image: "https://images.seeklogo.com/logo-png/52/1/jetour-logo-png_seeklogo-524224.png" },
      ];
    },
    selectCarType(carType) {
      this.selectedCarType = carType.name; // Store the selected car type
      this.filteredItems.metaCategory = carType.name.toLowerCase(); // Clear metaCategory to avoid conflicts
      this.filterProducts(); // Trigger filtering
      console.log("Selected car type:", carType.name); // Debug log for car type click
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) this.drawerOpen = false;
    },
  },
  watch: {
    selectedLocation(newVal) {
      this.filteredItems.location = newVal ? newVal.toLowerCase() : "";
      console.log("Selected Location:", newVal); // Debug log for location
      this.selectedMetaLocation = "";
      this.filterProducts();
    },
    selectedMetaLocation(newVal) {
      this.filteredItems.metaLocation = newVal ? newVal.toLowerCase() : "";
      console.log("Selected Meta Location:", newVal); // Debug log for metaLocation
      this.filterProducts();
    },
  },
};
</script>
<style scoped>
.darkFilter {
  background-color: #333; /* Dark background for dropdown options */
  color: white; /* White text for dropdown options */
}

.filters-container{
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.parent {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-top: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.main-container {
  display: flex;
  width: 100%;
  gap: 15px; /* Reduced gap between left and right sections to 15px */
}

.left-section {
  flex: 3;
}

.right-section {
  flex: 1;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.search-add-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 200px; /* Match product card width */
  margin-bottom: 20px;
  padding: 0 10px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 16px;
  background-color: white;
  color: #333;
}

.dark-search {
  background-color: #333;
  color: white;
  border-color: #555;
}

.add-offer-button {
  padding: 10px 20px;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-offer-button:hover {
  background-color: darkorange;
}

.scrollable-container {
  width: 100%;
  max-width: 200px; /* Match product card width */
  overflow-y: auto;
  max-height: calc(100vh - 120px); /* Ensure it has a height */
  padding: 0 10px;
}

.products-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-card {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 200px; /* Updated max-width to 200px */
  padding: 10px;
  height: 150px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  background-color: white;
  overflow: hidden;
  position: relative;
}

.product-card:hover {
  transform: scale(1.02);
}

.product-image {
  width: 100px; /* Adjusted to fit within 200px max-width */
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.product-info h3 {
  margin: 0;
  font-size: 14px; /* Reduced font size to fit smaller card */
  color: #009688;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-info h3.seen-title {
  color: red;
}

.product-info p {
  margin: 5px 0 0;
  font-size: 12px; /* Reduced font size to fit smaller card */
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicators {
  display: flex;
  gap: 5px; /* Reduced gap to fit smaller card */
  margin-top: 5px;
}

.seen-indicator,
.favourite-indicator {
  font-size: 12px; /* Reduced font size */
  color: #666;
}

.dark-text .seen-indicator,
.dark-text .favourite-indicator {
  color: white;
}

.price {
  position: absolute;
  bottom: 5px;
  left: 5px;
  font-size: 12px; /* Reduced font size */
  font-weight: bold;
  color: #009688;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
}

.time-location {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.time-difference {
  font-size: 12px; /* Reduced font size */
  color: #666;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.location {
  font-size: 12px; /* Reduced font size */
  color: #666;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.white-card {
  background-color: white;
}

.grey-card {
  background-color: #f5f5f5;
}

.loading-indicator {
  text-align: center;
  margin: 20px 0;
  font-weight: bold;
  color: #666;
}

.dark-card {
  background-color: #222 !important;
  color: #fff !important;
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
}

.dark-text p {
  color: white !important;
}

.category-filter {
  width: 100%;
  max-width: 2000px; /* Match product card width */
  margin: 0 auto 20px auto;
}

.imported-component {
  width: 100%;
  max-width: 2000px; /* Match product card width */
  margin: 0 auto 20px auto;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-dropdown {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
}

.car-types-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.car-type-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.car-type-item:hover {
  background-color: #f0f0f0;
}

.car-type-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.drawer-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  color: #009688;
  cursor: pointer;
  padding: 0 10px;
}

.drawer-close {
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    gap: 10px; /* Adjusted for mobile */
  }

  .right-section {
    position: relative;
    width: 100%;
  }

  .drawer-toggle {
    display: block;
  }

  .filters-container {
    display: none;
  }

  .drawer-open .filters-container {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    width: 2000px; /* Match product card width */
    height: 100%;
    background-color: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 1000;
    overflow-y: auto;
  }

  .search-add-container {
    justify-content: space-between;
    align-items: center;
  }

  .scrollable-container {
    max-width: 100%; /* Allow full width on mobile */
  }

  .product-card {
    max-width: 100%; /* Allow full width on mobile */
  }
}
.parent {
  max-width: 2000px; /* Changed from 1400px */
}

.search-add-container {
  max-width: 2000px; /* Match product card width */
}

.scrollable-container {
  max-width: 2000px; /* Match product card width */
}

.product-card {
  max-width: 2000px; /* Updated from larger size */
}

.product-image {
  width: 100px; /* Adjusted to fit within 200px */
}

.product-info h3 {
  font-size: 14px; /* Reduced for smaller card */
}

.product-info p {
  font-size: 12px; /* Reduced for smaller card */
}

.category-filter {
  max-width: 2000px; /* Match product card width */
}

.imported-component {
  max-width: 2000px; /* Match product card width */
}

@media (max-width: 768px) {
  .drawer-open .filters-container {
    width: 200px; /* Match product card width */
  }
}

/* Taskbar Styles */
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px 0;
  z-index: 1000;
}

.dark-mode .taskbar {
  background-color: #333;
  border-top-color: #555;
}

.taskbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #666;
}

.dark-mode .taskbar-item {
  color: #ccc;
}

.taskbar-item i {
  font-size: 20px;
  margin-bottom: 5px;
}

.taskbar-item span {
  font-size: 12px;
}
</style>