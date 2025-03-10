<template>
  <div :class="isDark ? 'category-filter-dark' : 'category-filter'" style="width: 100%;">
    <div
        v-for="category in categories"
        :key="category.name"
        class="category-item"
        @click="selectCategory(category)"
        :class="{ active: selectedCategory === category.name }"
    >
      <div class="icon-container">
        <img :src="category.image" :alt="category.name" class="category-icon" />
      </div>
      <span class="category-name">{{ category.name }}</span>
    </div>
  </div>
</template>

<script>
import BottomNavbar from "./secondNavbar.vue";
export default {
  name: "CategoryFilterWithImages",
  props: {
    categories: {
      type: Array,
      required: true,
    },
    isDark: {
      type: Boolean,
      required: true, 
    },
  },

  components: {
    BottomNavbar,
  },
  data() {
    return {
      selectedCategory: null,
      isDark: false, // Default state
    };
  },
  created() {
    this.updateTheme(); // Initialize theme on component creation
    console.log("Component created, isDark:", this.isDark);
  },
  mounted() {
    console.log("Component mounted, isDark:", this.isDark);
    // Listen for custom theme-changed event
    window.addEventListener("theme-changed", this.updateTheme.bind(this));
  },
  beforeUnmount() {
    // Cleanup event listener
    window.removeEventListener("theme-changed", this.updateTheme);
  },
  methods: {
    updateTheme() {
      console.log("updateTheme called"); // Debug log
      const theme = localStorage.getItem("theme");
      console.log("Current theme in localStorage:", theme); // Debug log
      this.isDark = theme === "true"; // Convert string to boolean
      console.log("Updated isDark:", this.isDark); // Debug log
    },
    selectCategory(category) {
      this.selectedCategory = category.name;
      this.$emit("category-selected", category.name, category.value);
    },

  },
};
</script>

<style scoped>
.category-filter {
  display: flex;
  gap: 15px;
  padding: 10px;
  overflow-x: auto;
  background-color: white;
  border-bottom: 1px solid #ccc;
}

.category-filter-dark {
  display: flex;
  gap: 15px;
  padding: 10px;
  overflow-x: auto;
  background-color: #222;
  border-bottom: 1px solid #555;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  background-color: white;
  transition: transform 0.2s;
  width: 150px; /* Match the width of product cards */
  text-align: center;
}

.category-item:hover {
  transform: scale(1.05);
}

.category-item.active {
  background-color: orange;
}

.icon-container {
  width: 100px; /* Large icon size */
  height: 100px; /* Large icon size */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.category-icon {
  width: 100%; /* Ensure the icon fills the container */
  height: 100%; /* Ensure the icon fills the container */
  object-fit: cover;
  border-radius: 8px;
}

.category-name {
  font-size: 14px;
  text-align: center;
}

.category-filter {
  width: 39%;
}

@media (max-width: 2000px) {
  .category-filter {
    width: 95%;
  }
}
</style>