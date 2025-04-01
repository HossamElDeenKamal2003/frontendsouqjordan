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
    <div class="taskbar-item" @click="navigateTo('addOffer')">
      <i class="fas fa-plus"></i>
      <span>Add Offer</span>
    </div>
    <div class="taskbar-item" @click="toggleNotifications">
      <i class="fas fa-bell"></i>
      <span>Notifications</span>
    </div>
    <div class="taskbar-item" @click="navigateTo('home')">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </div>

    <!-- Notification Dialog -->
    <div v-if="showNotifications" class="notification-dialog">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button @click="closeNotifications" class="close-btn">×</button>
      </div>
      <div class="notification-list">
        <div
            v-for="notification in notifications"
            :key="notification._id"
            @click="goToProduct(notification)"
            class="notification-item"
        >
          <img
              :src="notification.userId.profileImage"
              alt="User"
              class="user-avatar"
          >
          <div class="notification-content">
            <h4 style="color: green;">{{ notification.title }}</h4>
            <p>{{ notification.body }}</p>
            <span class="timestamp">{{ formatDate(notification.createdAt) }}</span>
          </div>
        </div>
        <div v-if="!notifications.length" class="no-notifications">
          No notifications yet
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "fixedBottom",
  data() {
    return {
      showNotifications: false,
      notifications: [],
      isDark: false, // Assuming you have this for dark mode
      userId: null
    }
  },
  created(){
    this.userId = localStorage.getItem("userId");
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    async toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        await this.fetchNotifications();
      }
    },
    closeNotifications() {
      this.showNotifications = false;
    },
    async fetchNotifications() {
      try {
        console.log(this.userId)
        const response = await fetch(`https://backend.jordan-souq.com/comments/get-notification/${this.userId}`);
        const data = await response.json();
        this.notifications = data.notifications;
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },
    goToProduct(notification) {
      if (notification.postId) {
        // Assuming you have a product route that takes postId as parameter
        this.$router.push({
          name: 'details',
          params: { id: notification.postId }
        });
        this.showNotifications = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString(); // Adjust format as needed
    }
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

/* Notification Dialog Styles */
.notification-dialog {
  position: fixed;
  bottom: 70px; /* Slightly higher above taskbar */
  left: 15px;
  right: 15px;
  max-height: 70vh;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border-radius: 12px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1001;
  animation: slideUp 0.3s ease-out;
}

.dark-mode .notification-dialog {
  background: linear-gradient(135deg, #2a2a2a, #333333);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
}

.notification-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: inherit;
  backdrop-filter: blur(5px);
}

.notification-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dark-mode .notification-header h3 {
  color: #e0e0e0;
}

.close-btn {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0 5px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.1);
  color: #333;
}

.dark-mode .close-btn {
  color: #aaa;
}

.dark-mode .close-btn:hover {
  color: #fff;
}

.notification-list {
  padding: 10px;
  max-height: calc(70vh - 60px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ccc #f8f9fa;
}

.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.notification-list::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.dark-mode .notification-list {
  scrollbar-color: #555 #333;
}

.dark-mode .notification-list::-webkit-scrollbar-thumb {
  background: #555;
}

.dark-mode .notification-list::-webkit-scrollbar-track {
  background: #333;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin: 5px 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.notification-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark-mode .notification-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .notification-item:hover {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  border: 2px solid #eee;
  transition: transform 0.2s ease;
}

.notification-item:hover .user-avatar {
  transform: scale(1.05);
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
}

.dark-mode .notification-content h4 {
  color: #dfe6e9;
}

.notification-content p {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.dark-mode .notification-content p {
  color: #b0b8c4;
}

.timestamp {
  font-size: 11px;
  color: #999;
  font-style: italic;
}

.dark-mode .timestamp {
  color: #777;
}

.no-notifications {
  padding: 25px;
  text-align: center;
  color: #777;
  font-style: italic;
  opacity: 0.8;
}

.dark-mode .no-notifications {
  color: #999;
}

/* Animation */
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>