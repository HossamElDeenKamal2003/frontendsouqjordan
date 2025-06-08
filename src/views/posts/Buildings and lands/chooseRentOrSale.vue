<template>
  <div :class="['shared-parent', { 'dark-mode': isDark, 'rtl-direction': isRTL }]">
    <div class="menu-container">
      <div class="menu-header">
        <h3>{{ $t('building.type') }}</h3>
      </div>
      <ul class="menu-list">
        <li
            v-for="option in buildingOptions"
            :key="option.value"
            class="menu-item"
            :class="{ 'selected': option.value === selectedOption }"
            @click="selectBuildingOption(option.value)"
        >
          <router-link
              :to="{ path: '/typesOfbuildings', query: { saleState: option.value } }"
          >
            <span class="text">{{ $t(`building.options.${option.index}.name`) }}</span>
            <span class="arrow" :class="{ 'rtl-arrow': isRTL }">→</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BuildingComponent",
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      buildingOptions: [
        { index: 0, value: "sale" },
        { index: 1, value: "rent" }
      ],
      selectedOption: null
    };
  },
  computed: {
    isRTL() {
      return this.$i18n.locale === 'ar';
    }
  },
  created() {
    this.loadSelectedOption();
  },
  methods: {
    selectBuildingOption(value) {
      console.log("Selected building option:", value);
      this.selectedOption = value;

      // Save to localStorage in productForm.data
      this.saveToProductForm(value);

      this.$emit("building-type-selected", value);
    },
    loadSelectedOption() {
      try {
        // Check if productForm exists in localStorage
        const productForm = JSON.parse(localStorage.getItem('productForm'));
        if (productForm && productForm.data && productForm.data.saleState) {
          this.selectedOption = productForm.data.saleState;
          this.$emit("building-type-selected", productForm.data.saleState);
        }
      } catch (e) {
        console.error("Error loading productForm from localStorage:", e);
      }
    },
    saveToProductForm(value) {
      try {
        // Get existing productForm or create new one
        let productForm = JSON.parse(localStorage.getItem('productForm')) || { data: {} };

        // Update saleState in productForm.data
        productForm.data = {
          ...productForm.data,
          saleState: value
        };

        // Save back to localStorage
        localStorage.setItem('productForm', JSON.stringify(productForm));
      } catch (e) {
        console.error("Error saving to productForm in localStorage:", e);
      }
    }
  },
};
</script>

<style scoped>
/* Existing styles remain unchanged */
.menu-item.selected {
  background-color: #e0e0e0;
}

.dark-mode .menu-item.selected {
  background-color: #555;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.shared-parent {
  font-family: Arial, sans-serif;
  direction: ltr;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
}

.shared-parent.rtl-direction {
  direction: rtl;
  font-family: 'Arial Arabic', sans-serif;
}

.dark-mode {
  background-color: #222 !important;
  color: #fff;
}

.menu-container {
  width: 80vw;
  background-color: #fff;
  border-radius: 25px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}

.dark-mode .menu-container {
  background-color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
  height: calc((100vh - 40px) / 14);
}

.menu-header h3 {
  font-size: 24px;
  font-weight: bold;
  color: green;
  margin: 0;
}

.dark-mode .menu-header h3 {
  color: #4caf50;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  align-items: stretch; /* Changed from center to stretch for full width */
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  cursor: pointer;
  color: #333;
  border-radius: 8px;
  transition: all 0.2s ease;
  height: calc((100vh - 40px) / 8);
  flex-shrink: 0;
  width: 100%; /* Ensure full width */
}

.dark-mode .menu-item {
  color: #eee;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.dark-mode .menu-item:hover {
  background-color: #444;
}

.text {
  flex-grow: 1;
  font-size: 1.2em;
  font-weight: 500;
}

.arrow {
  font-size: 24px;
  color: #007bff;
  margin-left: 10px;
}

.arrow.rtl-arrow {
  margin-left: 0;
  margin-right: 10px;
  transform: scaleX(-1);
}

.dark-mode .arrow {
  color: #4dabf7;
}

@media (max-width: 1200px) {
  .menu-container {
    width: 90vw;
    padding: 30px;
    height: calc(100vh - 60px);
  }
  .menu-header {
    height: calc((100vh - 60px) / 14);
  }
  .menu-item {
    height: calc((100vh - 60px) / 8);
  }
}

@media (max-width: 768px) {
  .text {
    font-size: 1.1em;
  }
  .arrow {
    font-size: 20px;
  }
}

@media (max-width: 576px) {
  .menu-container {
    padding: 20px;
    border-radius: 15px;
    height: calc(100vh - 40px);
  }
  .menu-header {
    height: calc((100vh - 40px) / 14);
  }
  .menu-item {
    height: calc((100vh - 40px) / 8);
    padding: 0 15px;
  }
  .menu-header h3 {
    font-size: 20px;
  }
  .text {
    font-size: 1em;
  }
}

@media (max-width: 400px) {
  .arrow {
    font-size: 18px;
  }
  .menu-header h3 {
    font-size: 18px;
  }
}

a {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 20px;
}
</style>