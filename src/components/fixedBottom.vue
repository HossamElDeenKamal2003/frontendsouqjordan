<template>
  <div :class="['taskbar', { 'dark-mode': isDark }]">
    <div class="taskbar-item" @click="navigateTo('chat')">
      <i class="fas fa-comment"></i>
      <span>Chat</span>
    </div>

    <div class="taskbar-item" @click="navigateTo('favourites')">
      <i class="fas fa-heart"></i>
      <span>Favorites</span>
    </div>
    <div class="taskbar-item" @click="navigateTo('add-offer')">
      <i class="fas fa-plus"></i>
      <span>Add Offer</span>
    </div>
    <div class="taskbar-item" @click="navigateTo('notifications')">
      <i class="fas fa-bell"></i>
      <span>Notifications</span>
    </div>
    <div class="taskbar-item" @click="navigateTo('home')">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "fixedBottom",
  methods:{
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
  }
}
</script>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px 0;
  z-index: 1000;
}

.dark-mode .taskbar {
  background-color: #333;
  border-top-color: #555;
}

.taskbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #666;
}

.dark-mode .taskbar-item {
  color: #ccc;
}

.taskbar-item i {
  font-size: 20px;
  margin-bottom: 5px;
}

.taskbar-item span {
  font-size: 12px;
}
</style>