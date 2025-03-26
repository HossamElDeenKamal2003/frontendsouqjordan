<template>
  <div class="parent2">
    <!-- Horizontal List of Building Types -->
    <ul class="horizontal-list">
      <li
          v-for="buildingType in buildingTypes"
          :key="buildingType"
          :class="['list-item', { 'selected': selectedBuildingType === buildingType }]"
          @click="handleBuildingTypeClick(buildingType)"
      >
        {{ buildingType }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ConstVariables } from "../../../const.js";

export default {
  name: "BuildingComponent",
  data() {
    return {
      buildingTypes: [
        ...ConstVariables.realStateRentTypes, // Rent types
        ...ConstVariables.realEstateSaleTypeList, // Sale types
      ], // Combine rent and sale types
      selectedBuildingType: null, // Track the selected building type
    };
  },
  methods: {
    // Handle building type click
    handleBuildingTypeClick(buildingType) {
      this.selectedBuildingType = buildingType; // Set the selected building type
      const lowercaseBuildingType = buildingType.toLowerCase(); // Convert to lowercase
      this.$emit("building-type-selected", lowercaseBuildingType); // Emit the lowercase building type
    },
  },
};
</script>

<style scoped>
.parent2 {
  padding: 20px;
  overflow-x: auto; /* Enable horizontal scrolling if the list overflows */
  width: 100%;
  max-width: 2000px;
}

.horizontal-list {
  list-style-type: none; /* Remove default list styling */
  padding: 0;
  margin: 0;
  display: flex; /* Make the list horizontal */
  gap: 10px; /* Add spacing between list items */
}

.list-item {
  white-space: nowrap; /* Prevent text from wrapping */
  padding: 8px 12px; /* Add padding for better clickability */
  border: 1px solid #ccc; /* Optional: Add a border */
  border-radius: 4px; /* Optional: Add rounded corners */
  cursor: pointer; /* Show pointer cursor on hover */
  transition: background-color 0.3s ease; /* Smooth hover effect */
}

.list-item:hover {
  background-color: #f0f0f0; /* Change background color on hover */
}

/* Style for selected items */
.list-item.selected {
  background-color: green; /* Green background for selected items */
  color: white; /* White text for better contrast */
}
</style>