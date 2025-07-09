```vue
<template>
  <div class="parent2">
    <!-- Display error message if no furniture types are available -->
    <div v-if="!furnitureTypes.length" class="error-message">
      {{ $t('furniture.errors.noCategoriesAvailable') || 'No furniture categories available. Please check translation data.' }}
    </div>

    <!-- Horizontal List of Furniture Types (Translated) -->
    <ul v-else class="horizontal-list">
      <li
          v-for="furniture in furnitureTypes"
          :key="furniture.value"
          :class="['list-item', { 'selected': selectedFurnitureType === furniture.value }]"
          @click="handleFurnitureTypeClick(furniture)"
      >
        {{ furniture.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FurnitureComponent",
  data() {
    return {
      selectedFurnitureType: null, // Track the selected furniture type (lowercase English key)
      // Mapping of English keys to lowercase keys for emission
      keyToLowercaseMap: {
        'Outdoor furniture': 'outdoorfurniture',
        'Office furniture': 'officefurniture',
        'Houseware': 'houseware',
        'Beds and mattresses': 'bedsandmattresses',
        'Antiques and decor': 'antiquesanddecor',
        'Cabinets and cupboards': 'cabinetsandcupboards',
        'tables and chairs': 'tablesandchairs',
        'Sofas and furnishings': 'sofasandfurnishings'
      }
    };
  },
  computed: {
    // Get translated furniture types from furnitureCategories
    furnitureTypes() {
      try {
        const categories = this.$i18n.messages[this.$i18n.locale]?.furniture?.furnitureCategories || {};
        console.log('Current locale:', this.$i18n.locale); // Debug: Log current locale
        console.log('Furniture Categories:', categories); // Debug: Log furnitureCategories
        const furnitureList = Object.keys(categories).map((key) => ({
          value: this.keyToLowercaseMap[key] || key.toLowerCase().replace(/\s+/g, ''),
          label: this.$t(`furniture.furnitureCategories.${key}`) || key
        }));
        console.log('Mapped Furniture Types:', furnitureList); // Debug: Log mapped furniture types
        return furnitureList;
      } catch (error) {
        console.error('Error accessing furniture categories:', error);
        return [];
      }
    }
  },
  mounted() {
    // Log furniture types when the component is mounted
    console.log('Mounted - Available Furniture Types:', this.furnitureTypes);
  },
  methods: {
    // Handle furniture type click
    handleFurnitureTypeClick(furniture) {
      if (this.selectedFurnitureType === furniture.value) {
        this.selectedFurnitureType = null; // Deselect if already selected (toggle off)
        console.log('User Deselected Furniture Type:', {
          key: furniture.value,
          display: furniture.label
        }); // Debug: Log deselection
        this.$emit('furniture-selected', null); // Emit null to indicate deselection
      } else {
        this.selectedFurnitureType = furniture.value; // Set the selected furniture type
        console.log('User Selected Furniture Type:', {
          key: furniture.value,
          display: furniture.label
        }); // Debug: Log selection
        this.$emit('furniture-selected', furniture.value); // Emit the lowercase furniture type
      }
    }
  }
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

.error-message {
  color: red;
  text-align: center;
  padding: 10px;
  font-size: 14px;
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