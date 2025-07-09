<template>
  <div class="building-component">
    <div class="button-container">
      <button
          :class="['filter-button', { 'selected': selectedType === 'sale' }]"
          @click="selectType('sale')"
      >
        {{ $t('buildings.sale') }}
      </button>
      <button
          :class="['filter-button', { 'selected': selectedType === 'rent' }]"
          @click="selectType('rent')"
      >
        {{ $t('buildings.rent') }}
      </button>
    </div>
    <ul v-if="selectedType && buildingTypesList.length" class="horizontal-list">
      <li
          v-for="buildingType in buildingTypesList"
          :key="buildingType.value"
          :class="['list-item', { 'selected': selectedBuildingType === buildingType.value }]"
          @click="selectBuildingType(buildingType)"
      >
        {{ buildingType.label }}
      </li>
    </ul>
    <div v-if="selectedType && !buildingTypesList.length" class="error-message">
      {{ $t('buildings.errors.noTypesAvailable') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuildingComponent',
  data() {
    return {
      selectedType: null,
      selectedBuildingType: null,
    };
  },
  computed: {
    buildingTypesList() {
      if (!this.selectedType) return [];
      // Try to get keys from the current locale first
      const localeTypes = this.$i18n.messages[this.$i18n.locale]?.buildings?.types?.[this.selectedType];
      const enTypes = this.$i18n.messages['en']?.buildings?.types?.[this.selectedType];
      const typeObj = localeTypes || enTypes;
      if (!typeObj) return [];
      return Object.keys(typeObj).map(key => ({
        value: key,
        label: this.$t(`buildings.types.${this.selectedType}.${key}`)
      }));
    }
  },
  methods: {
    selectType(type) {
      this.selectedType = type;
      this.selectedBuildingType = null;
      this.$emit('sale-rent-selected', type);
    },
    selectBuildingType(buildingType) {
      this.selectedBuildingType = buildingType.value;
      console.log('Selected building type value:', buildingType.value); // key
      console.log('Selected building type label:', buildingType.label); // translated label
      this.$emit('building-type-selected', buildingType.value);
    },
  },
  watch: {
    '$i18n.locale': {
      immediate: true,
      handler() {
        this.buildingTypesList;
      }
    }
  }
};
</script>


<style scoped>
.building-component {
  width: 100%;
  text-align: left;
  padding: 10px;
}

h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.filter-button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.filter-button:hover {
  background-color: #f0f0f0;
}

.filter-button.selected {
  background-color: green;
  color: white;
  border-color: green;
}

.horizontal-list {
  list-style-type: none;
  margin: 0;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
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

.error-message {
  color: red;
  text-align: center;
  padding: 10px;
  font-size: 14px;
}
</style>
```