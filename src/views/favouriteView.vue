<template>
  <div :class="['profile-container', { 'dark-mode': isDark }]">
    <!-- Favourite Posts Section -->
    <div class="favourite-posts-section">
      <div class="products-container">
        <router-link
            v-for="(post, index) in favouritePosts"
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FavouriteView",
  props: {
    isDark: Boolean,
  },
  data() {
    return {
      favouritePosts: [], // Array to store favourite posts
    };
  },
  async created() {
    await this.fetchUserFavourite(); // Fetch favourite posts when the component is created
  },
  methods: {
    // Fetch user's favourite posts
    async fetchUserFavourite() {
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
            `https://backend.jordan-souq.com/product/favourite/${userId}`
        );
        // Map the response to extract the product details from the `productId` field
        this.favouritePosts = response.data.favourite.map((item) => ({
          ...item.productId, // Spread the product details
          _id: item.productId._id, // Ensure the post ID is correctly mapped
        }));
      } catch (error) {
        console.error("Error fetching user favourite posts:", error);
      }
    },

    // Format price with a dollar sign
    formatPrice(price) {
      return `$${price}`;
    },

    // Format time difference (e.g., "2 hours ago")
    formatTimeDifference(createdAt) {
      const now = new Date();
      const createdDate = new Date(createdAt);
      const diffInSeconds = Math.floor((now - createdDate) / 1000);
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    },
  },
};
</script>

<style scoped>
/* Your existing styles remain unchanged */
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
</style>