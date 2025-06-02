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

    <!-- Location Filters (Moved above search bar) -->
    <div class="location-filters" :class="{ 'location-filters-mobile': isMobile }">
      <select
          v-model="selectedLocation"
          :class="isDark ? 'darkFilter' : 'lightFilter'"
          @change="filterProducts"
          class="filter-dropdown"
      >
        <option value="">{{ $t('filters.all_locations') }}</option>
        <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
      </select>
      <select
          v-model="selectedMetaLocation"
          :class="isDark ? 'darkFilter' : 'lightFilter'"
          @change="filterProducts"
          class="filter-dropdown"
      >
        <option value="">{{ $t('filters.all_cities') }}</option>
        <option v-for="metaLoc in metaLocations" :key="metaLoc" :value="metaLoc">
          {{ metaLoc }}
        </option>
      </select>
    </div>
    <fixedBottom />

    <!-- Main Layout with Left and Right Sections -->
    <div class="main-container">
      <!-- Left Section: Search and Products -->
      <div class="left-section">
        <!-- Search and Add Offer Section -->
        <div class="search-add-container">
          <input
              type="text"
              :placeholder="$t('search.placeholder')"
              v-model="searchQuery"
              :class="['search-input', isDark ? 'dark-search' : '']"
          />
          <button class="add-offer-button" @click="addOffer">
            {{ $t('buttons.add_offer') }}
          </button>
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
                  :alt="$t('products.image_alt')"
                  class="product-image"
              />
              <div :class="['product-info', isDark ? 'dark-text' : '']">
                <h3 :class="{ 'seen-title': product.isSeen }">{{ product.title }}</h3>
                <p>{{ product.description }}</p>
                <div class="indicators">
                  <span v-if="product.isSeen" class="seen-indicator">
                    👁️ {{ $t('products.seen') }}
                  </span>
                  <span v-if="product.isFavourite" class="favourite-indicator">
                    ❤️ {{ $t('products.favourite') }}
                  </span>
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
            <p v-if="loading">{{ $t('products.loading') }}</p>
          </div>
        </div>
      </div>

      <!-- Right Section: Filters (Desktop) / Drawer (Mobile) -->
      <div class="right-section" :class="{ 'drawer-open': drawerOpen && isMobile, 'dark-theme': isDark }">
        <!-- Filters Content -->
        <div class="filters-container" :class="{ 'drawer-content': isMobile && drawerOpen }">
          <!-- Close Button in Drawer (Mobile Only) -->
          <button v-if="isMobile && drawerOpen" class="drawer-close" @click="toggleDrawer">
            ✕
          </button>

          <!-- Car Type Images (Moved to right section) -->
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
import fixedBottom from "../components/fixedBottom.vue";
import enTranslations from '@/locales/en.json'
import arTranslations from '@/locales/ar.json'
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
    fixedBottom,
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
      translations: this.$i18n.locale === 'ar' ? arTranslations : enTranslations
    };
  },
  computed: {
    filteredProducts() {
      let result = [...this.products];
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
            (product) =>
                product.metaCategory &&
                product.metaCategory.toLowerCase() === this.filteredItems.metaCategory.toLowerCase()
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
      return this.selectedLocation ? ConstVariables.locationsMap[this.selectedLocation] || [] : [];
    },
  },
  created() {
    this.loadCategories();
    this.loadCarTypes();
  },
  mounted() {
    this.getTrips();
    this.$nextTick(this.setupInfiniteScroll);
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    async getTrips() {
      if (this.loading || this.page > this.totalPages) return;
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
        this.page++;
      } catch (error) {
        console.error("Error fetching trips:", error.message);
      } finally {
        this.loading = false;
      }
    },
    async filterProducts() {
      try {
        this.loading = true;
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
                carType: this.filteredItems.carType ? this.filteredItems.carType.toLowerCase() : null,
                location: this.filteredItems.location ? this.filteredItems.location.toLowerCase() : null,
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
        this.$toast.error(this.$t('errors.filter_error')); // Use toast for error feedback
      } finally {
        this.loading = false;
      }
    },
    setupInfiniteScroll() {
      this.observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && !this.loading) {
              this.getTrips();
            }
          },
          { threshold: 0.5 }
      );
      if (this.$refs.loadMoreTrigger) {
        this.observer.observe(this.$refs.loadMoreTrigger);
      }
    },
    handleCategorySelected(categoryName, categoryValue) {
      this.resetComponents();
      this.filteredItems.metaCategory = null;
      this.filteredItems.carType = null;
      if (categoryName === this.$t('categories.all.name')) {
        this.selectedCategory = null;
        this.filteredItems.category = "all";
      } else if (categoryName === this.$t('categories.cars.name')) {
        this.showCarsComponent = true;
        this.selectedCategory = "Cars";
        this.filteredItems.category = categoryValue;
        this.selectedCarType = ConstVariables.carsTypeList;
      } else if (categoryName === this.$t('categories.building.name')) {
        this.showBuildingComponent = true;
        this.selectedCategory = "Building";
        this.filteredItems.category = categoryValue;
      } else if (categoryName === this.$t('categories.devices.name')) {
        this.showDevices = true;
        this.selectedCategory = "Devices";
        this.filteredItems.category = categoryValue;
      } else if (categoryName === this.$t('categories.furniture.name')) {
        this.showFurnitureComponent = true;
        this.selectedCategory = "Furniture";
        this.filteredItems.category = "others";
        this.filteredItems.metaCategory = "furniture";
      } else if (categoryName === this.$t('categories.personal_needs.name')) {
        this.showPersonalneeds = true;
        this.selectedCategory = "Personal Needs";
        this.filteredItems.category = "others";
        this.filteredItems.metaCategory = "personal accessories";
      } else if (categoryName === this.$t('categories.jobs.name')) {
        this.jobsComponent = true;
        this.selectedCategory = "Jobs";
        this.filteredItems.category = "others";
        this.filteredItems.metaCategory = "jobs";
      } else if (categoryName === this.$t('categories.others.name')) {
        this.othersComponent = true;
        this.selectedCategory = "Others";
        this.filteredItems.category = categoryValue;
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
      this.filteredItems.metaCategory = carType.toLowerCase();
      this.filteredItems.carType = null;
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
      return this.$t('products.price_format', { price }); // Use i18n for currency formatting
    },
    formatTimeDifference(createdAt) {
      const now = new Date();
      const createdDate = new Date(createdAt);
      const diffInSeconds = Math.floor((now - createdDate) / 1000);
      if (diffInSeconds < 60) {
        return this.$t('time.seconds_ago', { count: diffInSeconds });
      }
      if (diffInSeconds < 3600) {
        return this.$t('time.minutes_ago', { count: Math.floor(diffInSeconds / 60) });
      }
      if (diffInSeconds < 86400) {
        return this.$t('time.hours_ago', { count: Math.floor(diffInSeconds / 3600) });
      }
      return this.$t('time.days_ago', { count: Math.floor(diffInSeconds / 86400) });
    },
    loadCategories() {
      console.log(this.$t('categories'))
      this.categories = this.translations.categories.map((cat) => ({
        name: cat.name,
        value: cat.value,
        image: cat.image,
        category: cat.category,
      }));
    },
    loadCarTypes() {
      this.carTypes = this.translations.carTypes.map((carType) => ({
        name: carType.name,
        image: carType.image,
      }));
    },
    selectCarType(carType) {
      this.selectedCarType = carType.name;
      this.filteredItems.metaCategory = carType.name.toLowerCase();
      this.filterProducts();
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) this.drawerOpen = false;
    },
    addOffer() {
      this.$router.push('/add-offer');
    },
  },
  watch: {
    selectedLocation(newVal) {
      this.filteredItems.location = newVal ? newVal.toLowerCase() : "";
      this.selectedMetaLocation = "";
      this.filterProducts();
    },
    selectedMetaLocation(newVal) {
      this.filteredItems.metaLocation = newVal ? newVal.toLowerCase() : "";
      this.filterProducts();
    },
  },
};
</script>
<style scoped>
.darkFilter {
  background-color: #333;
  color: white;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.parent {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-top: 20px;
  max-width: 2000px;
  margin: 0 auto;
}

.main-container {
  display: flex;
  width: 100%;
  gap: 15px;
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

.location-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  width: 100%;
  max-width: 2000px;
  padding: 0 10px;
}

.filter-dropdown {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
}

.search-add-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin-bottom: 20px;
  padding: 0 10px;
  /*position: sticky;*/
  top: 0;
  z-index: 10;
  flex-wrap: wrap;
}

.drawer-toggle{
  font-size: xx-large;
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
  max-width: 1400px;
  overflow-y: auto;
  max-height: calc(80vh - 120px);
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
  max-width: 100%;
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
  width: 100px;
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
  font-size: 16px;
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
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicators {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.seen-indicator,
.favourite-indicator {
  font-size: 12px;
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
  font-size: 14px;
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
  font-size: 12px;
  color: #666;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.location {
  font-size: 12px;
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
.favourite-indicator{
  color: red;
}
.seen-indicator{
  color: green;
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
  max-width: 2000px;
  margin: 0 auto 20px auto;
}

.imported-component {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 20px auto;
}

.car-types-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
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
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  z-index: 1001;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    gap: 10px;
  }

  .right-section {
    position: relative;
    width: 100%;
  }

  .drawer-toggle {
    display: block;
    font-size: xx-large;
  }

  .filters-container {
    display: none;
  }

  .drawer-open .filters-container {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    width: 80%;
    height: 100%;
    background-color: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    padding: 40px 20px 20px;
    z-index: 1000;
    overflow-y: auto;
  }

  .location-filters {
    flex-direction: column;
    padding: 0 15px;
  }

  .search-add-container {
    padding: 0 15px;
  }

  .scrollable-container {
    padding: 0 15px;
  }
}

.imported-component {
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

.imported-component::-webkit-scrollbar {
  height: 5px;
}

.imported-component::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}
.parent > .imported-component {
  margin-left: 0 !important;
  padding: 10px;
}
.imported-component ul.horizontal-list {
  padding: 20px;
}
/* Update these styles in your HomeView component */

/* General imported component styling */
.imported-component {
  width: 100%;
  max-width: 1400px;
  margin: 0 0 20px 0 !important; /* Remove auto margins */
  padding: 10px;
  text-align: left;
  overflow-x: auto;
}

/* Style all horizontal lists in imported components */
.imported-component > div > ul.horizontal-list,
.imported-component > ul.horizontal-list {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  margin: 0;
  list-style: none;
  justify-content: flex-start;
  overflow-x: auto;
  width: 100%;
}

/* Style all list items in imported components */
.imported-component .list-item {
  white-space: nowrap;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.imported-component .list-item:hover {
  background-color: #f0f0f0;
}

.imported-component .list-item.selected {
  background-color: green;
  color: white;
}

/* Ensure all content in imported components aligns left */
.imported-component > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

/* Remove any potential centering from parent elements */
.parent > .imported-component {
  align-self: flex-start;
  margin-left: 0 !important;
  padding-left: 10px;
}

/* Scrollbar styling for all imported components */
.imported-component {
  -webkit-overflow-scrolling: touch;
}

.imported-component::-webkit-scrollbar {
  height: 5px;
}

.imported-component::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

a{
  text-decoration: none;

}
</style>