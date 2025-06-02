<template>
  <div class="all">
    <div v-if="category === 'سيارات'">
      <cars-component />
    </div>
    <div v-if="category === 'devices'">
      <devices-component />
    </div>
    <div v-if="category === 'jobs'">
      <add-jobscomponent />
    </div>
    <div v-if="category === 'personal_accessories'">
      <personalAccessoriescomponent />
    </div>
    <div v-if="category === 'furniture'">
      <furniture-component />
    </div>
    <div v-if="category === 'other'">
      <others-component />
    </div>
  </div>
</template>

<script>
import carsComponent from "./cars/carsComponent.vue";
import devicesComponent from "./devices/addPostDevices.vue";
import addJobscomponent from "./jobs/jobsComponent.vue";
import personalAccessoriescomponent from "./personal accessories/personalAccessoriesaddPost.vue"
import furnitureComponent from "./furniture/furnitureCompoenent.vue";
import othersComponent from "./others/othersComponent.vue"

export default{
  name: 'postData',
  components: {
    carsComponent,
    devicesComponent,
    addJobscomponent,
    personalAccessoriescomponent,
    furnitureComponent,
    othersComponent
  },
  data(){
    return{
      category: localStorage.getItem('selectedCategory')
    }
  }
}
</script>