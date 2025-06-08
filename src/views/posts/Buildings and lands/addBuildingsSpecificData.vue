<template>
  <div :class="['shared-parent', { 'dark-mode': isDark, 'rtl-direction': isRTL }]">
    <div class="specific" v-if="specific=== 1">
      <AddSpecificData />
    </div>
    <div class="specific" v-if="specific === 2">
      <LandsComponent />
    </div>
  </div>
</template>

<script>
import AddSpecificData from "./addSpecificData.vue";
import LandsComponent from "./addLandsdata.vue";
export default {
  name: "AddBuildingsSpecificData",

  props: {
    type: {
      type: String,
      required: true
    },
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AddSpecificData,
    LandsComponent,
  },
  data() {
    return {
      specific: 0,
    };
  },
  mounted() {
    console.log('Received type:', this.type.toLowerCase());
  },
  created() {
    console.log("before: ,", this.specific);
    if (this.type.toLowerCase().includes('apartment') || this.type.toLowerCase().includes('villa')) {
      this.specific = 1;
    }else if(this.type.toLowerCase().includes('land')){
      this.specific = 2;
    }
    console.log("after: ,:", this.specific);
  }
};
</script>

<style scoped>
.shared-parent {
  font-family: Arial, sans-serif;
  direction: ltr;
  background-color: #f5f7fa; /* Light theme background */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition for theme switch */
}

.rtl-direction {
  direction: rtl;
  font-family: 'Arial Arabic', sans-serif;
}

.dark-mode {
  background-color: #222; /* Dark theme background */
  color: #fff; /* Default text color in dark mode */
}

h1, h2, h3, h4, h5, h6 {
  font-weight: bold;
  color: #008000; /* Light theme heading color (green) */
}

.dark-mode h1, .dark-mode h2, .dark-mode h3, .dark-mode h4, .dark-mode h5, .dark-mode h6 {
  color: #4CAF50; /* Dark theme heading color (lighter green) */
}
</style>