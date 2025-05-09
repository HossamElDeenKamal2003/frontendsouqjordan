<template>
  <div class="all">
    <div v-if="category === 'سيارات'">
      <cars-component />
    </div>
    <div v-if="category === 'devices'">
      <devices-component />
    </div>
  </div>
</template>

<script>
import carsComponent from "./cars/carsComponent.vue";
import devicesComponent from "./devices/addPostDevices.vue";
export default{
  name: 'postData',
  components: {
    carsComponent,
    devicesComponent
  },
  data(){
    return{
      category: localStorage.getItem('selectedCategory')
    }
  }
}
</script>