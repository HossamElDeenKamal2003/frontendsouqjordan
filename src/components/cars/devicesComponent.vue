<template>
  <div class="parent2">
    <!-- Horizontal List of Device Types -->
    <ul class="horizontal-list">
      <li
          v-for="device in devices"
          :key="device"
          :class="['list-item', { 'selected': selectedDeviceType === device }]"
          @click="handleDeviceTypeClick(device)"
      >
        {{ device }}
      </li>
    </ul>

    <!-- Horizontal List of Device Models -->
    <ul v-if="selectedDeviceType" class="horizontal-list">
      <li
          v-for="model in getDeviceModels(selectedDeviceType)"
          :key="model"
          :class="['list-item', { 'selected': selectedDeviceModel === model }]"
          @click="handleDeviceModelClick(model)"
      >
        {{ model }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ConstVariables } from "../../../const.js";

export default {
  name: "DevicesComponent",
  data() {
    return {
      devices: ConstVariables.devicesTypeList, // List of device types
      selectedDeviceType: null, // Track the selected device type
      selectedDeviceModel: null, // Track the selected device model
    };
  },
  methods: {
    // Handle device type click
    handleDeviceTypeClick(device) {
      this.selectedDeviceType = device; // Set the selected device type
      this.selectedDeviceModel = null; // Reset selected device model when a new type is selected
      const lowercaseDevice = device.toLowerCase(); // Convert to lowercase
      this.$emit("device-type-selected", lowercaseDevice); // Emit the lowercase device type
    },
    // Handle device model click
    handleDeviceModelClick(model) {
      this.selectedDeviceModel = model; // Set the selected device model
      const lowercaseModel = model.toLowerCase(); // Convert to lowercase
      this.$emit("model-selected", lowercaseModel); // Emit the lowercase model
    },
    // Get device models dynamically based on the selected device type
    getDeviceModels(deviceType) {
      // Map device types to their corresponding model lists in ConstVariables
      const deviceModelsMap = {
        Apple: ConstVariables.appleModelsList,
        Samsung: ConstVariables.samsungModelsList,
        Sony: ConstVariables.sonyModelsList,
        "Special Number": ConstVariables.specialNumbersList,
        "Home & Kitchen Appliances": ConstVariables.homeKitchenList,
        BlcakBerry: ConstVariables.blackBerryModelsList, // Note: Typo in your data as "BlcakBerry"
        Canon: ConstVariables.canonModelsList,
        LG: ConstVariables.lgModelsList,
        Nokia: ConstVariables.nokiaModelsList,
        Microsoft: ConstVariables.microsoftModelsList,
        Nikon: ConstVariables.nikonModelsList,
        HTC: ConstVariables.htcModelsList,
        Toshiba: ConstVariables.toshibaModelsList,
        DELL: ConstVariables.dellModelsList,
        Huawei: ConstVariables.huaweiModelsList,
        Asus: ConstVariables.asusModelsList,
        Acer: ConstVariables.acerModelsList,
        Panasonic: ConstVariables.panasonicModelsList,
        Fujifilm: ConstVariables.fujifilmModelsList,
        Hitachi: ConstVariables.hitachiModelsList,
        Olympus: ConstVariables.olympusModelsList,
        Computers: ConstVariables.computersModelsList,
        Gaming: ConstVariables.gamingModelsList,
        "TV & Audio": ConstVariables.tvAndAudioModelsList,
        Generator: ConstVariables.generatorsModelsList,
        "Account and Subscription": ConstVariables.accountsAndSubscriptionsModelsList,
        "Digital Camera": ConstVariables.digitalCameraModelsList,
        "Uncategorized Devices": ConstVariables.unCategorizedModelsList,
      };

      // Return the models for the selected device type
      return deviceModelsMap[deviceType] || [];
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