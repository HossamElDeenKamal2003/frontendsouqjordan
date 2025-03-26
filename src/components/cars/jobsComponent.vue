<template>
  <div class="parent2">
    <!-- Horizontal List of Job Types -->
    <ul class="horizontal-list">
      <li
          v-for="job in jobTypes"
          :key="job"
          :class="['list-item', { 'selected': selectedJobType === job }]"
          @click="handleJobTypeClick(job)"
      >
        {{ job }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ConstVariables } from "../../../const.js";

export default {
  name: "JobsList",
  data() {
    return {
      jobTypes: ConstVariables.jobsList, // List of job types from const.js
      selectedJobType: null, // Track the selected job type
    };
  },
  methods: {
    // Handle job type click
    handleJobTypeClick(job) {
      if (this.selectedJobType === job) {
        this.selectedJobType = null; // Deselect if already selected (toggle off)
      } else {
        this.selectedJobType = job; // Set the selected job type
        const lowercaseJob = job.toLowerCase(); // Convert to lowercase
        this.$emit("job-selected", lowercaseJob); // Emit the selected job type
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