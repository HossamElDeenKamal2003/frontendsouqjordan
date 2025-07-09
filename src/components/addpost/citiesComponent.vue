<template>
  <div :class="['shared-parent', { 'dark-mode': isDark }]">
    <div class="menu-container">
      <div class="menu-header">
        <h3>
          {{ $t('locationsMap.chooseRegion') }}
        </h3>
      </div>
      <ul class="menu-list">
        <li
            v-for="regionKey in regionKeys"
            :key="regionKey"
            class="menu-item"
            @click="selectRegion(regionKey)"
        >
          <span class="text">{{ $t('locations.' + regionKey.toLowerCase()) }}</span>
          <span class="arrow">→</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { saveProductForm, getProductForm } from '@/productFormStorage';

export default {
  name: "RegionSelector",
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // List of region keys as in your locales/en.json and ar.json
    regionKeys() {
      // Use Object.keys to get all region keys from locations in i18n
      // Or hardcode if you want a specific order
      return [
        "Amman", "Zarqa", "Irbid", "Ajloun", "Jerash", "Mafraq", "Balqa", "Karak", "Tafilah", "Ma'an", "Aqaba", "Madaba", "Ramtha", "Al-Husn", "Shoubak", "Wadi Musa", "Russeifa", "Ain Al-Basha", "Fuheis", "Mahis", "Dhiban", "Mu'tah", "Al-Salt", "Al-Mafraq", "Al-Rusaifa", "Al-Jubeiha", "Marj Al-Hamam", "Abdoun", "Sweifieh", "Khalda", "Tla' Al-Ali", "Dabouq", "Deir Ghbar", "Al-Muqabalain", "Sahab", "Naur"
      ];
    }
  },
  methods: {
    selectRegion(regionKey) {
      const currentForm = getProductForm() || {};
      // Always send the English region key (lowercased)
      saveProductForm({
        ...currentForm,
        location: regionKey.toLowerCase(),
        displayLocation: this.$t('locations.' + regionKey.toLowerCase()),
      });
      localStorage.setItem('selectedRegion', regionKey.toLowerCase());
      this.$router.push('/city');
    },
  },
};
</script>

<style scoped>
.shared-parent {
  font-family: Arial, sans-serif;
  direction: v-bind('currentLanguage === "ar" ? "rtl" : "ltr"');
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