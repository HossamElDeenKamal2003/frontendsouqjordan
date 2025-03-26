<template>
  <div class="relative">
    <!-- Bottom Bar Notification Icon -->
    <button @click="dialog = true" class="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg">
      🔔
    </button>

    <!-- Dialog -->
    <div v-if="dialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-lg rounded-xl p-4 relative max-h-[80vh] overflow-y-auto">

        <!-- Close Button -->
        <button @click="dialog = false" class="absolute top-2 right-2 text-gray-600 text-lg">✖️</button>

        <h2 class="text-xl font-semibold mb-4">Notifications</h2>

        <!-- Comments -->
        <div>
          <h3 class="font-bold mb-2">Comments</h3>
          <div v-if="comments.length">
            <div v-for="notification in sortedComments" :key="notification._id"
                 @click="handleNotificationClick(notification)"
                 class="p-3 mb-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex gap-3">
              <img :src="notification.user.profileImage" alt="Profile" class="w-12 h-12 rounded-full">
              <div>
                <p class="font-semibold">{{ notification.user.username }}</p>
                <p>{{ notification.body }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(notification.createdAt) }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">No comments yet.</p>
        </div>

        <!-- Messages -->
        <div class="mt-6">
          <h3 class="font-bold mb-2">Messages</h3>
          <div v-if="messages.length">
            <div v-for="notification in sortedMessages" :key="notification._id"
                 @click="handleNotificationClick(notification)"
                 class="p-3 mb-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex gap-3">
              <img :src="notification.user.profileImage" alt="Profile" class="w-12 h-12 rounded-full">
              <div>
                <p class="font-semibold">{{ notification.user.username }}</p>
                <p>{{ notification.body }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(notification.createdAt) }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">No messages yet.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Sample notifications prop or you can fetch it from API
const notifications = ref([
  {
    _id: "1",
    user: { profileImage: "https://i.pravatar.cc/150?img=1", username: "User1" },
    body: "Commented on your post",
    createdAt: "2025-03-24T18:01:33Z",
    type: "comment",
    postId: "101"
  },
  {
    _id: "2",
    user: { profileImage: "https://i.pravatar.cc/150?img=2", username: "User2" },
    body: "Sent you a message",
    createdAt: "2025-03-24T17:50:00Z",
    type: "message"
  }
  // Add more
])

const dialog = ref(false)
const router = useRouter()

const comments = computed(() => notifications.value.filter(n => n.type === 'comment'))
const messages = computed(() => notifications.value.filter(n => n.type === 'message'))

const sortedComments = computed(() => [...comments.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
const sortedMessages = computed(() => [...messages.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

const handleNotificationClick = (notification) => {
  if (notification.postId) {
    dialog.value = false
    router.push(`/product/${notification.postId}`)
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString()
}
</script>

<style scoped>
/* Optional Styling */
</style>
