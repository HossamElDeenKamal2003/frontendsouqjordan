<template>
  <div :class="['profile-container', { 'dark-mode': isDark }]">
    <!-- Cover Image Section -->
    <div class="cover-image-section">
      <img :src="user.coverImage || defaultCoverImage" alt="Cover Image" class="cover-image" />
      <button @click="openCoverImageUpload" class="edit-cover-button">
        <i class="fas fa-camera"></i> Edit Cover Photo
      </button>
    </div>

    <!-- Profile Info Section -->
    <div class="profile-info-section">
      <div class="profile-image-container">
        <img :src="user.profileImage || defaultProfileImage" alt="Profile Image" class="profile-image" />
        <button @click="openProfileImageUpload" class="edit-profile-button">
          <i class="fas fa-camera"></i>
        </button>
      </div>
      <div class="profile-details">
        <h1 class="username">{{ user.username }}</h1>
        <div class="stats">
          <span>{{ userPosts.length }} Posts</span>
          <span>{{ user.followers || 0 }} Followers</span>
          <span>{{ user.following || 0 }} Following</span>
        </div>
      </div>
    </div>

    <!-- Tabs for Posts and Followed Posts -->
    <div class="tabs">
      <button :class="['tab', { active: activeTab === 'posts' }]" @click="activeTab = 'posts'">
        Posts
      </button>
      <button :class="['tab', { active: activeTab === 'followed' }]" @click="activeTab = 'followed'">
        Followed Posts
      </button>
    </div>

    <!-- Posts Section -->
    <div v-if="activeTab === 'posts'" class="posts-section">
      <div class="products-container">
        <router-link
            v-for="(post, index) in userPosts"
            :key="post._id"
            :to="{ name: 'details', params: { id: post._id } }"
            :class="[
            'product-card',
            index % 2 === 0 ? 'white-card' : 'grey-card',
            isDark ? 'dark-card' : ''
          ]"
        >
          <img
              :src="
              post.images && post.images.length
                ? post.images[0]
                : require('@/assets/jordan image.jpeg')
            "
              alt="Product Image"
              class="product-image"
          />
          <div :class="['product-info', isDark ? 'dark-text' : '']">
            <h3 :class="{ 'seen-title': post.isSeen }">{{ post.title }}</h3>
            <p>{{ post.description }}</p>
            <div class="indicators">
              <span v-if="post.isSeen" class="seen-indicator">👁️ Seen</span>
              <span v-if="post.isFavourite" class="favourite-indicator">️❤ Favourite</span>
            </div>
            <div v-if="post.price" class="price">
              {{ formatPrice(post.price) }}
            </div>
            <div class="time-location">
              <div class="time-difference">
                ⏰ {{ formatTimeDifference(post.createdAt) }}
              </div>
              <div v-if="post.location" class="location">
                📍 {{ post.location }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Followed Posts Section -->
    <div v-if="activeTab === 'followed'" class="followed-posts-section">
      <div class="products-container">
        <router-link
            v-for="(post, index) in followedPosts"
            :key="post._id"
            :to="{ name: 'details', params: { id: post._id } }"
            :class="[
            'product-card',
            index % 2 === 0 ? 'white-card' : 'grey-card',
            isDark ? 'dark-card' : ''
          ]"
        >
          <img
              :src="
              post.images && post.images.length
                ? post.images[0]
                : require('@/assets/jordan image.jpeg')
            "
              alt="Product Image"
              class="product-image"
          />
          <div :class="['product-info', isDark ? 'dark-text' : '']">
            <h3 :class="{ 'seen-title': post.isSeen }">{{ post.title }}</h3>
            <p>{{ post.description }}</p>
            <div class="indicators">
              <span v-if="post.isSeen" class="seen-indicator">👁️ Seen</span>
              <span v-if="post.isFavourite" class="favourite-indicator">️❤ Favourite</span>
            </div>
            <div v-if="post.price" class="price">
              {{ formatPrice(post.price) }}
            </div>
            <div class="time-location">
              <div class="time-difference">
                ⏰ {{ formatTimeDifference(post.createdAt) }}
              </div>
              <div v-if="post.location" class="location">
                📍 {{ post.location }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Image Upload Dialogs -->
    <div v-if="isCoverImageUploadOpen" class="dialog-backdrop" @click="closeCoverImageUpload">
      <div class="dialog" @click.stop>
        <button @click="closeCoverImageUpload" class="close-button">
          <i class="fas fa-times"></i>
        </button>
        <h2>Update Cover Image</h2>
        <input type="file" @change="handleCoverImageUpload" accept="image/*" />
      </div>
    </div>

    <div v-if="isProfileImageUploadOpen" class="dialog-backdrop" @click="closeProfileImageUpload">
      <div class="dialog" @click.stop>
        <button @click="closeProfileImageUpload" class="close-button">
          <i class="fas fa-times"></i>
        </button>
        <h2>Update Profile Image</h2>
        <input type="file" @change="handleProfileImageUpload" accept="image/*" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import defaultCoverImage from "@/assets/jordan image.jpeg";
import defaultProfileImage from "@/assets/jordan image.jpeg";

export default {
  name: "UserProfile",
  props: {
    isDark: Boolean,
  },
  data() {
    return {
      user: {
        username: "",
        profileImage: "",
        coverImage: "",
        bio: "",
        followers: 0,
        following: 0,
      },
      userPosts: [],
      followedPosts: [],
      activeTab: "posts",
      isCoverImageUploadOpen: false,
      isProfileImageUploadOpen: false,
      defaultCoverImage,
      defaultProfileImage,
    };
  },
  async created() {
    await this.fetchUserProfile();
    await this.fetchFollowedPosts();
  },
  methods: {
    async fetchUserProfile() {
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(`https://backend.jordan-souq.com/users/get-user/${userId}`);
        this.user = response.data.User;
        this.userPosts = response.data.posts;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },

    async fetchFollowedPosts() {
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(`https://backend.jordan-souq.com/users/getFollow/${userId}`);
        this.followedPosts = response.data.postsFollowed;
        console.log("Followed posts:", this.followedPosts);
      } catch (error) {
        console.error("Error fetching followed posts:", error);
      }
    },

    formatPrice(price) {
      return `$${price}`;
    },

    formatTimeDifference(createdAt) {
      const now = new Date();
      const createdDate = new Date(createdAt);
      const diffInSeconds = Math.floor((now - createdDate) / 1000);
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    },

    openCoverImageUpload() {
      this.isCoverImageUploadOpen = true;
    },
    closeCoverImageUpload() {
      this.isCoverImageUploadOpen = false;
    },

    openProfileImageUpload() {
      this.isProfileImageUploadOpen = true;
    },
    closeProfileImageUpload() {
      this.isProfileImageUploadOpen = false;
    },

    async handleCoverImageUpload(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("coverImage", file);
      formData.append("userId", localStorage.getItem("userId"));

      try {
        const response = await axios.patch(
            "https://backend.jordan-souq.com/users/update-cover-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
        );
        this.user.coverImage = response.data.coverImage;
        this.closeCoverImageUpload();
      } catch (error) {
        console.error("Error updating cover image:", error);
      }
    },

    async handleProfileImageUpload(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("userId", localStorage.getItem("userId"));

      try {
        const response = await axios.patch(
            "https://backend.jordan-souq.com/users/update-profile-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
        );
        this.user.profileImage = response.data.profileImage;
        this.closeProfileImageUpload();
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  background-color: #f0f2f5;
  color: #333;
  padding: 20px;
  min-height: 100vh;
}

.dark-mode.profile-container {
  background-color: #18191a;
  color: #e4e6eb;
}

.cover-image-section {
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 10px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: unset;
}

.edit-cover-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.profile-info-section {
  display: flex;
  align-items: center;
  margin-top: -50px;
  padding: 20px;
  flex-wrap: wrap;
}

.profile-image-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #fff;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-profile-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
}

.profile-details {
  margin-left: 20px;
}

.username {
  font-size: 24px;
  font-weight: bold;
}

.bio {
  font-size: 16px;
  color: #666;
}

.stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.tab {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.tab.active {
  border-bottom: 2px solid green;
  color: green;
}

.products-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-card {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  height: 150px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  background-color: white;
  overflow: hidden;
  position: relative;
}

.product-card:hover {
  transform: scale(1.02);
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.product-info h3 {
  margin: 0;
  font-size: 14px;
  color: #009688;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-info h3.seen-title {
  color: red;
}

.product-info p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicators {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.seen-indicator,
.favourite-indicator {
  font-size: 12px;
  color: #666;
}

.dark-text .seen-indicator,
.dark-text .favourite-indicator {
  color: white;
}

.price {
  position: absolute;
  bottom: 5px;
  left: 5px;
  font-size: 12px;
  font-weight: bold;
  color: #009688;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
}

.time-location {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.time-difference {
  font-size: 12px;
  color: #666;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.location {
  font-size: 12px;
  color: #666;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.white-card {
  background-color: white;
}

.grey-card {
  background-color: #f5f5f5;
}

.dark-card {
  background-color: #222 !important;
  color: #fff !important;
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
}

.dark-text p {
  color: white !important;
}

.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
}

.dark-mode .dialog {
  background-color: #242526;
  color: #e4e6eb;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #333;
}

.dark-mode .close-button {
  color: #e4e6eb;
}
</style>