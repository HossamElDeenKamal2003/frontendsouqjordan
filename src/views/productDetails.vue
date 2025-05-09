<template>
  <div :class="['product-details', { 'dark-theme': isDark }]">
    <fixedBottom />
    <div class="card">
      <div class="product-info">
        <div class="right">
          <h2>{{ product.title }}</h2>
          <p class="price">
            {{ product.price ? formatPrice(product.price) : 'User Not Send the price' }}
          </p>
          <p class="description">{{ product.description }}</p>
          <div class="location">📍 {{ product.ArLocation }}</div>
          <div class="time-difference">⏰ {{ formatTimeDifference(product.createdAt) }}</div>

          <!-- Icons Row -->
          <div class="icons-row">
            <!-- Favorite (Heart) -->
            <i
                class="icon fas"
                :class="product.isFavourite ? 'fa-heart active' : 'fa-heart inactive'"
                @click="toggleFavourite"
            ></i>

            <!-- Seen (Eye) -->
            <i v-if="product.isSeen" class="icon fas fa-eye"></i>

            <!-- Follow (User Plus/Check) -->
            <i
                class="icon fas"
                :class="isFollow ? 'fa-user-check active' : 'fa-user-plus inactive'"
                @click="toggleFollow"
            ></i>
          </div>

          <!-- User Info -->
          <div class="user-info">
            <div class="user-details">
              <p class="username">{{ user.username }}</p>
              <p class="user-phone">{{ user.phoneNumber }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Carousel -->
      <div class="image-carousel">
        <div v-for="(image, index) in product.images" :key="index" class="image-container">
          <img :src="image" alt="Product Image" class="product-image" />
          <p class="image-caption">صورة {{ index + 1 }}</p>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <h3>التعليقات</h3>
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment._id" class="comment">
            <p class="comment-user">{{ comment.user.username }}</p>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
          <p v-if="comments.length === 0" class="no-comments">لا توجد تعليقات بعد</p>
        </div>
        <div class="comment-input">
          <input
              v-model="newComment"
              placeholder="أضف تعليقاً..."
              @keyup.enter="addComment"
          />
          <button @click="addComment">إرسال</button>
        </div>
      </div>
    </div>

    <!-- Similar Products -->
    <div class="similar-products">
      <h3 style="color: #009688;">منتجات مشابهة</h3>
      <div class="similar-list">
        <div
            v-for="similarProduct in similar"
            :key="similarProduct._id"
            class="similar-card"
            @click="navigateToProduct(similarProduct._id)"
        >
          <img :src="similarProduct.images[0]" alt="Similar Product Image" class="similar-image" />
          <p class="similar-title">{{ similarProduct.title }}</p>
          <p class="similar-price">{{ formatPrice(similarProduct.price) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import fixedBottom from"../components/fixedBottom.vue"
export default {
  name: "ProductDetails",
  props: {
    isDark: Boolean,
  },
  data() {
    return {
      product: {
        images: [],
        title: "",
        description: "",
        price: 0,
        ArLocation: "",
        createdAt: "",
        isFavourite: false,
        isSeen: false,
      },
      user: {
        username: "",
        phoneNumber: "",
      },
      similar: [],
      comments: [],
      newComment: "",
      isFollow: false,
    };
  },
  components: {
    fixedBottom
  },
  created() {
    this.fetchProductDetails();
    this.getComments();
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId, oldId) {
        if (newId !== oldId) {
          this.fetchProductDetails();
          this.getComments();
        }
      },
    },
  },
  methods: {
    async fetchProductDetails() {
      const userId = localStorage.getItem("userId");
      const productId = this.$route.params.id;
      try {
        const response = await axios.get(
            `https://backend.jordan-souq.com/product/similar/${userId}/${productId}`
        );
        this.product = {
          ...response.data.post,
          isFavourite: response.data.post.isFavourite || false,
          isSeen: response.data.post.isSeen || false,
        };
        this.user = response.data.user;
        this.similar = response.data.similar;
        this.isFollow = response.data.post.isFollow || false;
        console.log(".................",response.data.post.isFollow);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    },
    async toggleFavourite() {
      const userId = localStorage.getItem("userId");
      const productId = this.$route.params.id;
      try {
        if (this.product.isFavourite) {
          await axios.delete(`https://backend.jordan-souq.com/product/favourite/${userId}/${productId}`);
          this.product.isFavourite = false;
        } else {
          await axios.post("https://backend.jordan-souq.com/product/favourite", {
            userId,
            productId,
          });
          this.product.isFavourite = true;
        }
      } catch (error) {
        console.error("Error toggling favourite:", error);
      }
    },
    async toggleFollow() {
      const userId = localStorage.getItem("userId");
      const postId = this.$route.params.id;
      console.log("Before toggle - isFollow:", this.isFollow); // Debug current state
      console.log("Before toggle - product.isFollow:", this.product.isFollow); // Debug product state

      try {
        if (this.product.isFollow === false) {
          console.log("Executing POST (add follow)");
          await axios.post("https://backend.jordan-souq.com/product/follow", {
            userId,
            postId,
          });
          this.isFollow = true; // Update local state
          this.product.isFollow = true; // Update product state
        } else if (this.product.isFollow === true) {
          console.log("Executing DELETE (remove follow)");
          await axios.delete("https://backend.jordan-souq.com/product/follow", {
            data: { userId, postId }, // Send data in the request body for DELETE
          });
          this.isFollow = false; // Update local state
          this.product.isFollow = false; // Update product state
          console.log("3333333333333");
        }
        console.log("After toggle - isFollow:", this.isFollow); // Debug new state
      } catch (error) {
        console.error("Error toggling follow:", error);
      }
    },
    async getComments() {
      const postId = this.$route.params.id;
      try {
        const response = await axios.get(
            `https://backend.jordan-souq.com/comments/get-comments/${postId}`
        );
        this.comments = response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
    async addComment() {
      if (!this.newComment.trim()) return;
      const userId = localStorage.getItem("userId");
      const postId = this.$route.params.id;
      try {
        await axios.post("https://backend.jordan-souq.com/comments/create-comment", {
          userId,
          postId,
          commenterId: userId,
          content: this.newComment,
        });
        this.newComment = "";
        await this.getComments();
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("فشل في إضافة التعليق");
      }
    },
    formatPrice(price) {
      return `$${price}`;
    },
    formatTimeDifference(createdAt) {
      const now = new Date();
      const createdDate = new Date(createdAt);
      const diffInSeconds = Math.floor((now - createdDate) / 1000);
      if (diffInSeconds < 60) return `${diffInSeconds} ثوانٍ مضت`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقائق مضت`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعات مضت`;
      return `${Math.floor(diffInSeconds / 86400)} أيام مضت`;
    },
    navigateToProduct(productId) {
      this.$router.push({ name: "details", params: { id: productId } });
      // No need to call fetchProductDetails here; watch will handle it
    },
  },
};
</script>

<style scoped>
/* Existing styles */
.product-details {
  padding: 20px;
  max-width: 80vw;
  margin: 0 auto;
  direction: rtl;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  background-color: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  min-height: 100vh;
  flex: 3;
}

.similar-products {
  flex: 1;
  background-color: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  max-width: 300px;
}

.similar-products h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.similar-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  max-height: 80vh;
}

.similar-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  padding: 10px;
}

.similar-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.similar-title {
  font-size: 14px;
  color: #333;
  margin: 5px 0;
}

.similar-price {
  font-size: 14px;
  color: #009688;
  font-weight: bold;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.right {
  flex: 1;
}

.product-info h2 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #009688;
  margin: 5px 0;
  text-align: initial;
}

.description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  text-align: initial;
}

.location,
.time-difference {
  font-size: 14px;
  color: #888;
  margin: 5px 0;
  text-align: initial;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.user-phone {
  font-size: 14px;
  color: #666;
}

.image-carousel {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image-container {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-caption {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

/* Icons styles */
.icons-row {
  display: flex;
  gap: 15px;
  margin: 10px 0;
}

.icon {
  font-size: 22px;
  cursor: pointer;
  transition: color 0.3s;
}

.icon.inactive {
  color: #666;
}

.icon.active {
  color: #e91e63;
}

.icon.fas.fa-eye {
  color: #009688;
  cursor: default;
}

/* Comments section styles */
.comments-section {
  margin-top: 20px;
}

.comments-section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.comment {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: initial;
}

.comment-user {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.comment-text {
  font-size: 14px;
  color: #666;
  margin: 5px 0 0;
}

.no-comments {
  font-size: 14px;
  color: #888;
  text-align: center;
}

.comment-input {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.comment-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.comment-input button {
  padding: 10px 20px;
  background-color: #009688;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.comment-input button:hover {
  background-color: #00796b;
}

/* Dark Theme Styles */
.dark-theme .card,
.dark-theme .similar-products {
  background-color: #2a2a2a;
}

.dark-theme .image-container,
.dark-theme .user-info,
.dark-theme .similar-card,
.dark-theme .comment {
  background-color: #3a3a3a;
}

.dark-theme .product-info h2,
.dark-theme .username,
.dark-theme .similar-title,
.dark-theme .comments-section h3,
.dark-theme .comment-user {
  color: #fff;
}

.dark-theme .description,
.dark-theme .user-phone,
.dark-theme .comment-text {
  color: #ddd;
}

.dark-theme .price,
.dark-theme .similar-price {
  color: #4caf50;
}

.dark-theme .location,
.dark-theme .time-difference,
.dark-theme .image-caption,
.dark-theme .no-comments {
  color: #bbb;
}

.dark-theme .icon.inactive {
  color: #888;
}

.dark-theme .icon.active {
  color: #f06292;
}

.dark-theme .icon.fas.fa-eye {
  color: #4caf50;
}

.dark-theme .comment-input input {
  background-color: #3a3a3a;
  color: #fff;
  border-color: #555;
}

.dark-theme .comment-input button {
  background-color: #4caf50;
}

.dark-theme .comment-input button:hover {
  background-color: #388e3c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-details {
    flex-direction: column;
    max-width: 100%;
    padding: 10px;
  }

  .card {
    min-height: auto;
    flex: 1;
  }

  .similar-products {
    max-width: 100%;
    margin-top: 20px;
  }

  .product-info h2 {
    font-size: 24px;
  }

  .price {
    font-size: 20px;
  }

  .description {
    font-size: 14px;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
  }

  .similar-list {
    max-height: none;
  }

  .icons-row {
    justify-content: center;
  }

  .comments-list {
    max-height: 200px;
  }
}

.product-details{
  margin-bottom: 60px;
}
</style>