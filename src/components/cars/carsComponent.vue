<template>
  <div class="parent2">

    <!-- Filter Icons -->
    <div class="icon-bar">
      <i class="fas fa-dollar-sign" @click="$emit('open-price-sheet')"></i>
      <i class="fas fa-car" @click="$emit('open-car-sheet')"></i>
    </div>

    <!-- Horizontal List of Car Types -->
    <ul class="horizontal-list">
      <li
          v-for="car in cars"
          :key="car"
          :class="['list-item', { 'selected': selectedCarType === getEnglishTranslation(`cars.brands.${car}`).toLowerCase() }]"
          @click="handleCarTypeClick(car)"
      >
        {{ $t(`cars.brands.${car}`) || car }}
      </li>
    </ul>

    <!-- Horizontal List of Car Models -->
    <ul v-if="selectedCarType && getCarModels(selectedCarType).length" class="horizontal-list">
      <li
          v-for="model in getCarModels(selectedCarType)"
          :key="model"
          :class="['list-item', { 'selected': selectedCarModel === getEnglishTranslation(`cars.models.${selectedCarType}.${model}`).toLowerCase() }]"
          @click="handleCarModelClick(model)"
      >
        {{ $t(`cars.models.${selectedCarType}.${model}`) || model }}
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  name: "CarsComponent",
  data() {
    return {
      selectedCarType: null,
      selectedCarModel: null,
    };
  },
  computed: {
    cars() {
      const carBrands = Object.keys(this.$i18n.messages[this.$i18n.locale]?.cars?.brands || {});
      console.log('Car Brands:', carBrands);
      return carBrands;
    },
    getCarModels() {
      return (carType) => {
        const models = this.$i18n.messages[this.$i18n.locale]?.cars?.models?.[carType] || {};
        const modelKeys = Object.keys(models);
        console.log(`Models for ${carType}:`, modelKeys);
        return modelKeys;
      };
    },
  },
  methods: {
    getEnglishTranslation(path) {
      try {
        const parts = path.split('.');
        let value = this.$i18n.messages['en'];
        for (const part of parts) {
          value = value?.[part];
          if (value === undefined) return ''; // Fallback to empty string
        }
        return value || '';
      } catch (e) {
        console.error('Error getting English translation:', e);
        return '';
      }
    },
    handleCarTypeClick(car) {
      const englishCarType = this.getEnglishTranslation(`cars.brands.${car}`);
      if (!englishCarType) {
        console.warn(`English translation not found for ${car}`);
        return;
      }
      const lowercaseEnglishCarType = englishCarType.toLowerCase();
      const lowercaseBrand = car.toLowerCase(); // Lowercase brand key
      this.selectedCarType = lowercaseEnglishCarType;
      this.selectedCarModel = null;
      console.log('User Selected Car Type:', {
        value: null, // No carType value for brand selection
        metaCategory: lowercaseBrand,
        key: car,
        display: this.$t(`cars.brands.${car}`) || car
      });
      this.$emit("car-type-selected", null); // Emit null for carType
      this.$emit("meta-category-selected", lowercaseBrand); // Emit lowercase brand
    },
    handleCarModelClick(model) {
      if (!this.selectedCarType) return;
      const englishModel = this.getEnglishTranslation(`cars.models.${this.selectedCarType}.${model}`);
      if (!englishModel) {
        console.warn(`English translation not found for ${this.selectedCarType}.${model}`);
        return;
      }
      const lowercaseEnglishModel = englishModel.toLowerCase();
      this.selectedCarModel = lowercaseEnglishModel;
      console.log('User Selected Car Model:', {
        value: lowercaseEnglishModel,
        metaCategory: this.selectedCarType.toLowerCase(), // Preserve brand
        key: model,
        display: this.$t(`cars.models.${this.selectedCarType}.${model}`) || model
      });
      this.$emit("model-selected", lowercaseEnglishModel);
    },
  },
};
</script>

<style scoped>
.parent2 {
  padding: 20px;
  overflow-x: auto;
  width: 100%;
  max-width: 2000px;
}

.horizontal-list {
  list-style-type: none;
  margin: 0;
  display: flex;
  gap: 10px;
}

.list-item {
  white-space: nowrap;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.list-item:hover {
  background-color: #f0f0f0;
}

.list-item.selected {
  background-color: green;
  color: white;
}

.imported-component {
  width: 100%;
  max-width: 1400px;
  margin: 0 0 20px 0;
  text-align: left;
  overflow-x: auto;
}

.imported-component ul.horizontal-list {
  display: flex;
  gap: 10px;
  padding: 15px;
  margin: 0;
  list-style: none;
  justify-content: flex-start;
  overflow-x: auto;
  width: 100%;
}

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
</style>
```