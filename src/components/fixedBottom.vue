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
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
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
        <div v-if="loadingNotifications" class="loading-notifications">
          <i class="fas fa-spinner fa-spin"></i> Loading notifications...
        </div>
        <template v-else>
          <div
              v-for="notification in notifications"
              :key="notification._id"
              @click="goToProduct(notification)"
              :class="['notification-item', { unread: !notification.read }]"
          >
            <img
                :src="notification.userId.profileImage || defaultAvatar"
                alt="User"
                class="user-avatar"
            >
            <div class="notification-content">
              <h4 :style="{ color: notification.read ? '#2c3e50' : 'green' }">
                {{ notification.title }}
              </h4>
              <p>{{ notification.body }}</p>
              <span class="timestamp">{{ formatDate(notification.createdAt) }}</span>
            </div>
          </div>
          <div v-if="!notifications.length" class="no-notifications">
            No notifications yet
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "FixedBottomBar",
  data() {
    return {
      showNotifications: false,
      notifications: [],
      isDark: false,
      userId: null,
      loadingNotifications: false,
      unreadCount: 0,
      defaultAvatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    };
  },
  created() {
    this.userId = localStorage.getItem("userId");
    this.checkUnreadNotifications();
  },
  methods: {
    async navigateTo(routeName) {
      const protectedRoutes = ['chat', 'favourites', 'addOffer'];

      if (protectedRoutes.includes(routeName)) {
        if (!this.userId) {
          this.showLoginToast();
          return;
        }
      }

      try {
        await this.$router.push({ name: routeName });
      } catch (error) {
        if (error.name !== 'NavigationDuplicated') {
          toast.error('Failed to navigate: ' + error.message);
        }
      }
    },

    showLoginToast() {
      toast.error('Please login to access this feature', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: this.isDark ? 'dark' : 'light'
      });
    },

    async toggleNotifications() {
      if (!this.userId) {
        this.showLoginToast();
        return;
      }

      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        await this.fetchNotifications();
      }
    },

    async fetchNotifications() {
      this.loadingNotifications = true;
      try {
        const response = await fetch(
            `https://backend.jordan-souq.com/comments/get-notification/${this.userId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        this.notifications = data.notifications || [];
        this.updateUnreadCount();
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
        this.notifications = [];
      } finally {
        this.loadingNotifications = false;
      }
    },

    async checkUnreadNotifications() {
      if (!this.userId) return;

      try {
        const response = await fetch(
            `https://backend.jordan-souq.com/comments/unread-count/${this.userId}`
        );
        const data = await response.json();
        this.unreadCount = data.count || 0;
      } catch (error) {
        console.error('Error checking unread notifications:', error);
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => !n.read).length;
    },

    async goToProduct(notification) {
      if (!notification.postId) return;

      try {
        // Mark as read if unread
        if (!notification.read) {
          await this.markAsRead(notification._id);
        }

        await this.$router.push({
          name: 'details',
          params: { id: notification.postId }
        });
        this.showNotifications = false;
      } catch (error) {
        toast.error('Failed to navigate to product');
      }
    },

    async markAsRead(notificationId) {
      try {
        await fetch(
            `https://backend.jordan-souq.com/comments/mark-as-read/${notificationId}`,
            { method: 'POST' }
        );
        this.checkUnreadNotifications();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },

    closeNotifications() {
      this.showNotifications = false;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  }
};
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
.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-notifications {
  padding: 20px;
  text-align: center;
  color: #666;
}

.dark-mode .loading-notifications {
  color: #aaa;
}

.notification-item.unread {
  background: rgba(100, 255, 100, 0.1) !important;
  border-left: 3px solid #4CAF50;
}

.dark-mode .notification-item.unread {
  background: rgba(76, 175, 80, 0.2) !important;
}

/* Ensure toast appears above everything */
.Vue-Toastify__toast-container {
  z-index: 9999 !important;
}

</style>