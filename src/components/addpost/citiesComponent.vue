<template>
  <div :class="['shared-parent', { 'dark-mode': isDark }]">
    <div class="menu-container">
      <div class="menu-header">
        <h3 style="color: green; font-size: larger;">Choose Region</h3>
      </div>
      <ul class="menu-list">
        <li
            v-for="region in regions"
            :key="region"
            class="menu-item"
            @click="selectRegion(region)"
        >
          <span class="text">{{ region }}</span>
          <span class="arrow">→</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ConstVariables } from "../../../const.js";
import { saveProductForm, getProductForm } from '@/productFormStorage';

const arabicRegions = {
  'Amman': 'عمان',
  'Zarqa': 'الزرقاء',
  'Irbid': 'إربد',
  'Ajloun': 'عجلون',
  'Jerash': 'جرش',
  'Mafraq': 'المفرق',
  'Balqa': 'البلقاء',
  'Karak': 'الكرك',
  'Tafilah': 'الطفيلة',
  'Ma\'an': 'معان',
  'Aqaba': 'العقبة',
  'Madaba': 'مادبا'
};

export default {
  name: "RegionSelector",
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      regions: Object.keys(ConstVariables.locationsMap)
    }
  },
  methods: {
    selectRegion(region) {
      const currentForm = getProductForm() || {};

      saveProductForm({
        ...currentForm,
        location: region.toLowerCase(),
        Arlocation: arabicRegions[region] || region
      });

      localStorage.setItem('selectedRegion', region.toLowerCase());
      this.$router.push('/city');
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
  height: calc(100vh - 40px); /* Account for padding */
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
  height: calc((100vh - 40px) / 14); /* Half of item height */
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
  height: calc((100vh - 40px) / 8); /* Exactly 1/7th of viewport */
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

.dark-mode .arrow {
  color: #4dabf7;
}

/* Responsive adjustments */
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
</style>