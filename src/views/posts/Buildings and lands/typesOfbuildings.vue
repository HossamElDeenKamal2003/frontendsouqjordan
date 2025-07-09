<template>
  <div :class="['shared-parent', { 'dark-mode': isDark, 'rtl-direction': isRTL }]">
    <div class="menu-container">
      <div class="menu-header">
        <h3>{{ $t('building.type') }}</h3>
      </div>
      <div v-if="saleState === 'sale'" class="sale">
        <ul class="menu-list">
          <li
              v-for="item in saleItems"
              :key="`sale-${item}`"
              class="menu-item"
              :class="{ selected: selectedOption === item }"
              @click="selectOption(item)"
          >
            <span class="text">{{ $t(`buildings2.types.sale.${item}`) }}</span>
            <span class="arrow" :class="{ 'rtl-arrow': isRTL }">{{ isRTL ? '←' : '→' }}</span>
          </li>
          <li v-if="!saleItems.length" class="menu-item error">{{ $t('buildings.errors.noTypesAvailable') }}</li>
        </ul>
      </div>
      <div v-else class="rent">
        <ul class="menu-list">
          <li
              v-for="item in rentItems"
              :key="`rent-${item}`"
              class="menu-item"
              :class="{ selected: selectedOption === item }"
              @click="selectOption(item)"
          >
            <span class="text">{{ $t(`buildings2.types.rent.${item}`) }}</span>
            <span class="arrow" :class="{ 'rtl-arrow': isRTL }">{{ isRTL ? '←' : '→' }}</span>
          </li>
          <li v-if="!rentItems.length" class="menu-item error">{{ $t('buildings.errors.noTypesAvailable') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TypesOfBuildings",
  props: {
    isDark: { type: Boolean, default: false },
    isRTL: { type: Boolean, default: false },
  },
  data() {
    return {
      saleState: this.getInitialSaleState(),
      selectedOption: null,
    };
  },
  computed: {
    isRTL() {
      return this.$i18n.locale === 'ar';
    },
    saleItems() {
      const saleObj = this.$i18n.messages[this.$i18n.locale]?.buildings2?.types?.sale;
      return saleObj ? Object.keys(saleObj) : [];
    },
    rentItems() {
      const rentObj = this.$i18n.messages[this.$i18n.locale]?.buildings2?.types?.rent;
      return rentObj ? Object.keys(rentObj) : [];
    },
  },
  methods: {
    getInitialSaleState() {
      const querySaleState = this.$route.query.saleState;
      if (querySaleState && ['sale', 'rent'].includes(querySaleState)) {
        return querySaleState;
      }
      try {
        const productForm = JSON.parse(localStorage.getItem('productForm'));
        if (productForm && productForm.data && productForm.data.saleState) {
          return productForm.data.saleState;
        }
      } catch (e) {
        console.error("Error loading productForm from localStorage:", e);
      }
      return 'sale';
    },
    selectOption(item) {
      this.selectedOption = item;
      localStorage.setItem('selectedBuildingType', item);
      // Always use the English key as type, regardless of locale
      this.$router.push({ path: '/AddBuildingsSpecificData', query: { type: item } });
    }
  },
  created() {
    if (!['sale', 'rent'].includes(this.saleState)) {
      this.saleState = 'sale';
    }
    const storedType = localStorage.getItem('selectedBuildingType');
    if (storedType && (this.saleItems.includes(storedType) || this.rentItems.includes(storedType))) {
      this.selectedOption = storedType;
    }
  },
  mounted() {
    document.documentElement.setAttribute('dir', this.isRTL ? 'rtl' : 'ltr');
  },
  watch: {
    '$i18n.locale': {
      immediate: true,
      handler() {},
    }
  }
};
</script>
<style scoped>
.shared-parent {
  font-family: Arial, sans-serif;
  direction: ltr;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.dark-mode {
  background-color: #222;
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
  color: #4CAF50;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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

.menu-item.selected {
  background-color: #e0f0ff;
}

.dark-mode .menu-item.selected {
  background-color: #555;
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

.error {
  color: red;
  font-style: italic;
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
```