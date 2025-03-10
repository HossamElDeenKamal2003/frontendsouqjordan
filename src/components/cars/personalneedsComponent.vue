<template>
  <div class="parent2">
    <!-- Horizontal List of Personal Needs Types -->
    <ul class="horizontal-list">
      <li
          v-for="need in personalNeedsTypes"
          :key="need"
          :class="['list-item', { 'selected': selectedNeedType === need }]"
          @click="handleNeedTypeClick(need)"
      >
        {{ need }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ConstVariables } from "../../../const.js";

export default {
  name: "PersonalNeedsList",
  data() {
    return {
      personalNeedsTypes: ConstVariables.personalAccessoriesList, // List of personal needs types
      selectedNeedType: null, // Track the selected personal need type
    };
  },
  methods: {
    // Handle personal need type click
    handleNeedTypeClick(need) {
      if (this.selectedNeedType === need) {
        this.selectedNeedType = null; // Deselect if already selected (toggle off)
      } else {
        this.selectedNeedType = need; // Set the selected personal need type
        const lowercaseNeed = need.toLowerCase(); // Convert to lowercase
        this.$emit("need-selected", lowercaseNeed); // Emit the selected personal need type
      }
    },
  },
};
</script>

<style scoped>
.parent2 {
  padding: 20px;
  overflow-x: auto; /* Enable horizontal scrolling if the list overflows */
  width: 100%;
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