<template>
  <div :class="['shared-parent', { 'dark-mode': isDark }]">
    <div class="menu-container">
      <div class="menu-header">
        <h3 style="color: green; font-size: larger;">Cities in {{ selectedRegion }}</h3>
      </div>
      <ul class="menu-list">
        <li
            class="menu-item"
            v-for="city in cities"
            :key="city"
            @click="selectCity(city)"
        >
          <span class="text">{{ city }}</span>
          <span class="arrow">→</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ConstVariables } from "../../../const.js";

export default {
  name: "CitySelector",
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedRegion: '',
      cities: []
    };
  },
  created() {
    this.loadSelectedRegion();
  },
  methods: {
    loadSelectedRegion() {
      const region = localStorage.getItem('selectedRegion');
      if (region) {
        // Convert to title case for display
        this.selectedRegion = region.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Get cities for this region
        this.cities = ConstVariables.locationsMap[this.selectedRegion] || [];
      } else {
        // Fallback if no region selected
        this.$router.push('/region');
      }
    },
    selectCity(city) {
      localStorage.setItem('selectedCity', city.toLowerCase());
      this.$router.push('/'); // Or wherever you want to go after city selection
    }
  }
};
</script>

<style scoped>
/* Using the exact same styles as the region selector */
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
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  cursor: pointer;
  color: #333;
  border-radius: 8px;
  transition: all 0.2s ease;
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
  }
}

@media (max-width: 768px) {
  .menu-container {
    width: 95vw;
    padding: 25px;
  }

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
  }

  .menu-header h3 {
    font-size: 20px;
  }

  .menu-item {
    padding: 12px 15px;
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