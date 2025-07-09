```vue
<template>
  <div :class="['chat-container', { 'dark-mode': isDark, 'rtl': $i18n.locale === 'ar' }]">
    <!-- Conversations List -->
    <div
        class="conversations-list"
        :class="{ 'show-mobile': !selectedConversationId, 'hide-mobile': selectedConversationId }"
    >
      <h3>{{ $t('chat.conversations') }}</h3>
      <div v-if="isLoadingConversations" class="loading">{{ $t('chat.loading') }}</div>
      <div v-else-if="errorMessageConversations" class="error-message">
        {{ errorMessageConversations }}
      </div>
      <div v-else-if="!conversations.length" class="empty-state">
        {{ $t('chat.no_conversation') }}
      </div>
      <ul v-else>
        <li
            v-for="conversation in conversations"
            :key="conversation.conversationId"
            @click="selectConversation(conversation.conversationId)"
            :class="{ active: selectedConversationId === conversation.conversationId }"
            role="button"
            :aria-label="$t('chat.conversations') + ': ' + getConversationName(conversation)"
        >
          <div class="conversation-info">
            <img
                :src="getAvatar(conversation)"
                :alt="$t('chat.avatar_alt', { name: getConversationName(conversation) })"
                class="avatar"
            />
            <div class="conversation-details">
              <div class="conversation-header">
                <span class="conversation-name">{{ getConversationName(conversation) }}</span>
                <span v-if="conversation.lastMessage" class="last-message-time">
                  {{ formatTimestamp(conversation.lastMessage.createdAt) }}
                </span>
                <span v-if="conversation.lastMessage && conversation.lastMessage.status !== 'read'" class="unread-icon">●</span>
              </div>
              <p v-if="conversation.lastMessage" class="last-message">
                {{ conversation.lastMessage.text }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Chat Window -->
    <div
        class="chat-window"
        :class="{ 'show-mobile': selectedConversationId, 'hide-mobile': !selectedConversationId }"
    >
      <div v-if="selectedConversationId" class="chat-content">
        <div class="chat-header">
          <button
              class="back-button"
              @click="selectedConversationId = null"
              :aria-label="$t('chat.back_to_conversations')"
          >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <img
              :src="getAvatar(getSelectedConversation)"
              :alt="$t('chat.avatar_alt', { name: getConversationName(getSelectedConversation) })"
              class="avatar"
          />
          <h3>{{ getConversationName(getSelectedConversation) }}</h3>
        </div>
        <div class="messages" ref="messagesContainer">
          <div v-if="isLoadingMessages" class="loading">{{ $t('chat.loading') }}</div>
          <div v-else-if="errorMessageMessages" class="error-message">
            {{ errorMessageMessages }}
          </div>
          <div
              v-else
              v-for="message in messages"
              :key="message._id"
              :class="[
                'message',
                message.isMine ? 'sent' : 'received',
                { 'title-message': message.title === true }
              ]"
          >
            <div class="message-content">
              <span v-if="message.title === true" class="title-badge">
                {{ $t('chat.title_badge') }}
              </span>
              <p>{{ message.text }}</p>
              <span class="timestamp">
                {{ formatTimestamp(message.createdAt) }}
                <span v-if="message.isMine" class="message-status">
                  <span style="font-size: x-large" v-if="message.status === 'sent'" class="status-icon">✔</span>
                  <span style="font-size: x-large" v-if="message.status === 'read'" class="status-icon">✔✔</span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="message-input">
          <input
              v-model="newMessage"
              :placeholder="$t('chat.type_message')"
              @keyup.enter="sendMessage"
              :aria-label="$t('chat.type_message')"
          />
          <button @click="sendMessage" :disabled="!newMessage.trim()">
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div v-else class="no-conversation-selected">
        <p>{{ $t('chat.no_conversation') }}</p>
      </div>
    </div>
    <fixed-bottom />
  </div>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";
import defaultAvatar from "@/assets/jordan image.jpeg";
import FixedBottom from "@/components/fixedBottom.vue";

export default {
  name: "Chat",
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    FixedBottom,
  },
  data() {
    return {
      socket: null,
      conversations: [],
      selectedConversationId: null,
      messages: [],
      newMessage: "",
      userId: localStorage.getItem("userId"),
      isLoadingConversations: false,
      isLoadingMessages: false,
      errorMessageConversations: null,
      errorMessageMessages: null,
      defaultAvatar,
    };
  },
  computed: {
    getSelectedConversation() {
      return this.conversations.find(
          (c) => c.conversationId === this.selectedConversationId
      ) || {};
    },
  },
  async created() {
    if (!this.userId) {
      this.errorMessageConversations = this.$t("chat.error_no_user");
      return;
    }

    this.socket = io("https://backend.jordan-souq.com");
    this.socket.on(`newMessage/${this.userId}`, (message) => {
      console.log('new message socket:', message);
      message.isMine = message.senderId._id === this.userId;
      this.updateLastMessage(message);
      if (this.selectedConversationId !== message.conversationId) {
        // Update conversation list for new message in other conversation
        this.fetchConversations();
      }
    });
    // Listen for message read updates
    this.socket.on("messageRead/:messageId", (data) => {
      const msg = this.messages.find(m => m._id === data.messageId);
      if (msg) {
        msg.status = 'read';
        this.$forceUpdate(); // Ensure UI updates
      }
    });
    await this.fetchConversations();
  },
  methods: {
    async fetchConversations() {
      this.isLoadingConversations = true;
      this.errorMessageConversations = null;
      try {
        const response = await axios.get(
            `https://backend.jordan-souq.com/api/conversations/${this.userId}`
        );
        this.conversations = response.data.conversations || [];
        // Sort conversations: unread last messages at the top
        this.conversations.sort((a, b) => {
          const aUnread = a.lastMessage && a.lastMessage.status !== 'read' ? 1 : 0;
          const bUnread = b.lastMessage && b.lastMessage.status !== 'read' ? 1 : 0;
          return bUnread - aUnread;
        });
      } catch (error) {
        this.errorMessageConversations = this.$t("chat.error");
        console.error("Error fetching conversations:", error);
      } finally {
        this.isLoadingConversations = false;
      }
    },

    async selectConversation(conversationId) {
      console.log('Opened conversationId:', conversationId);
      this.selectedConversationId = conversationId;
      this.isLoadingMessages = true;
      this.errorMessageMessages = null;
      try {
        const response = await axios.get(
            `https://backend.jordan-souq.com/api/conversations/getAllMessages/${conversationId}`,
            {
              headers: { userId: localStorage.getItem("userId") },
            }
        );
        this.messages = response.data.messages.map(message => ({
          ...message,
          isMine: message.senderId._id === this.userId
        }));
        console.log('Loaded messages:', this.messages.map(m => ({ _id: m._id, senderId: m.senderId._id, userId: this.userId, isMine: m.isMine, text: m.text })));
        this.$nextTick(() => {
          this.scrollToBottom(); // Ensure scroll to bottom after rendering
        });

        // Mark all unread messages as read for this conversation
        const unreadMessages = this.messages.filter(m => !m.isMine && m.status !== 'read');
        if (unreadMessages.length > 0) {
          unreadMessages.forEach(message => {
            this.socket.emit("markAsRead", { messageId: message._id, userId: this.userId });
          });
        }

        // Listen for received messages only
        if (this.socket) {
          this.socket.off(`internalMessages/${this.selectedConversationId}`); // Clean up previous listener
          this.socket.on(`internalMessages/${this.selectedConversationId}`, (message) => {
            console.log('Received internal message:', message);
            const senderId = message.senderId; // ✅ extract from socket message
            if (senderId !== this.userId) {
              message.isMine = false;
            } else {
              message.isMine = true;
            }
            this.messages.push(message);
            this.$nextTick(() => this.scrollToBottom());
            this.updateLastMessage(message);
          });
        }
      } catch (error) {
        this.errorMessageMessages = this.$t("chat.error");
        console.error("Error fetching messages:", error);
      } finally {
        this.isLoadingMessages = false;
      }
    },

    async sendMessage() {
      if (!this.newMessage.trim() || !this.selectedConversationId) return;

      const receiverId = this.getReceiverId();
      if (!receiverId) {
        this.errorMessageMessages = this.$t("chat.error_no_receiver");
        return;
      }

      try {
        const response = await axios.post(
            `https://backend.jordan-souq.com/api/conversations/sendMessage/${this.selectedConversationId}`,
            {
              senderId: this.userId,
              text: this.newMessage,
              receiverId,
            }
        );
        this.newMessage = "";
        this.$nextTick(() => this.scrollToBottom());
      } catch (error) {
        console.error("Error sending message:", error);
        this.errorMessageMessages = this.$t("chat.error");
      }
    },

    getReceiverId() {
      const conversation = this.conversations.find(
          (c) => c.conversationId === this.selectedConversationId
      );
      if (conversation) {
        const receiver = conversation.participants.find(
            (p) => p.user !== this.userId
        );
        return receiver ? receiver.user : null;
      }
      return null;
    },

    getConversationName(conversation) {
      if (!conversation) return this.$t("chat.unknown_user");
      if (conversation.name) return conversation.name;
      const otherUser = conversation.participants.find(
          (p) => p.user._id !== this.userId
      );
      return otherUser && otherUser.user && otherUser.user.username
          ? otherUser.user.username
          : this.$t("chat.unknown_user");
    },

    getAvatar(conversation) {
      if (!conversation) return this.defaultAvatar;
      const otherUser = conversation.participants.find(
          (p) => p.user !== this.userId
      );
      return otherUser && otherUser.avatar ? otherUser.avatar : this.defaultAvatar;
    },

    formatTimestamp(timestamp) {
      if (!timestamp) return this.$t("chat.unknown_time");
      const date = new Date(timestamp);
      return isNaN(date.getTime())
          ? this.$t("chat.unknown_time")
          : date.toLocaleTimeString(this.$i18n.locale, {
            hour: "2-digit",
            minute: "2-digit",
          });
    },

    updateLastMessage(message) {
      const conversation = this.conversations.find(
          (c) => c.conversationId === message.conversationId
      );
      if (conversation) {
        conversation.lastMessage = message;
        console.log('Updated lastMessage for conversationId:', message.conversationId);
        // Re-sort conversations after updating last message
        this.conversations.sort((a, b) => {
          const aUnread = a.lastMessage && a.lastMessage.status !== 'read' ? 1 : 0;
          const bUnread = b.lastMessage && b.lastMessage.status !== 'read' ? 1 : 0;
          return bUnread - aUnread;
        });
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight; // Scroll to bottom
      }
    },
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.off(`newMessage/${this.userId}`);
      this.socket.off(`internalMessages/${this.selectedConversationId}`);
      this.socket.off("messageRead/:messageId"); // Clean up messageRead listener
      this.socket.disconnect();
    }
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: calc(100vh - 120px); /* Adjust for navbar (60px) and fixed-bottom (60px) */
  background-color: #f0f0f0;
  margin-top: 60px; /* Space for fixed navbar */
  margin-bottom: 60px; /* Space for fixed-bottom */
  transition: background-color 0.3s;
  position: relative;
}

.rtl {
  direction: rtl;
}

.dark-mode {
  background-color: #0b141a;
}

.conversations-list {
  width: 320px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 0;
  transition: transform 0.3s ease;
}

.dark-mode .conversations-list {
  background-color: #111b21;
  border-right-color: #2a3942;
}

.conversations-list h3 {
  font-size: 1.125rem;
  font-weight: 600;
  padding: 16px;
  margin: 0;
  background-color: #f0f0f0;
  color: #111827;
  position: sticky;
  top: 0;
  z-index: 10;
}

.dark-mode .conversations-list h3 {
  background-color: #0b141a;
  color: #e0e0e0;
}

.conversations-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.conversations-list li {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.dark-mode .conversations-list li {
  border-bottom-color: #2a3942;
}

.conversations-list li:hover {
  background-color: #f5f5f5;
}

.dark-mode .conversations-list li:hover {
  background-color: #1f2a44;
}

.conversations-list li.active {
  background-color: #e5e7eb;
}

.dark-mode .conversations-list li.active {
  background-color: #2a3942;
}

.conversation-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conversation-name {
  font-weight: 500;
  font-size: 1rem;
  color: #111827;
}

.dark-mode .conversation-name {
  color: #e0e0e0;
}

.last-message-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark-mode .last-message-time {
  color: #a3a3a3;
}

.last-message {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark-mode .last-message {
  color: #a3a3a3;
}

.unread-icon {
  color: #ff0000; /* Red dot for unread */
  font-size: 1rem;
  margin-left: 8px;
}

.dark-mode .unread-icon {
  color: #ff5555; /* Lighter red for dark mode */
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ece5dd;
  transition: transform 0.3s ease;
}

.dark-mode .chat-window {
  background-color: #0b141a;
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: none; /* Hidden on desktop */
  background-color: #f0f0f0;
  padding: 12px 16px;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.dark-mode .chat-header {
  background-color: #0b141a;
  border-bottom-color: #2a3942;
}

.chat-header .avatar {
  width: 40px;
  height: 40px;
}

.chat-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
  flex: 1;
}

.dark-mode .chat-header h3 {
  color: #e0e0e0;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #111827;
  padding: 8px;
}

.dark-mode .back-button {
  color: #e0e0e0;
}

.messages {
  flex: 1;
  max-height: calc(100vh - 260px); /* Adjust for navbar (60px), header (60px), input (80px), fixed-bottom (60px) */
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  min-width: 70%; /* Increased width from 80% */
  display: flex;
  flex-direction: column;
  position: relative;
}

.message.sent {
  align-self: flex-end;
}

.message.received {
  align-self: flex-start;
}

.message-content {
  padding: 12px 16px; /* Increased padding for wider look */
  border-radius: 8px;
  position: relative;
  word-break: break-word;
  background-color: #ffffff;
  color: #111827;
}

.message.sent .message-content {
  background-color: #d9fdd3;
  color: #111827;
}

.dark-mode .message.sent .message-content {
  background-color: #005c4b;
  color: #e0e0e0;
}

.dark-mode .message.received .message-content {
  background-color: #1f2a44;
  color: #e0e0e0;
}

.message.title-message .message-content {
  background-color: #fef3c7;
  border: 1px solid #d97706;
  font-weight: 600;
}

.dark-mode .message.title-message .message-content {
  background-color: #713f12;
  border-color: #f59e0b;
  color: #fef3c7;
}

.title-badge {
  display: inline-block;
  font-size: 0.75rem;
  background-color: #d97706;
  color: #ffffff;
  padding: 3px 10px;
  border-radius: 4px;
  margin-bottom: 6px;
}

.dark-mode .title-badge {
  background-color: #f59e0b;
}

.timestamp {
  font-size: 0.6875rem;
  color: #6b7280;
  margin-top: 4px;
  text-align: right;
  display: flex;
  align-items: center;
  gap: 2px;
}

.dark-mode .timestamp {
  color: #a3a3a3;
}

.message-status {
  font-size: 0.6875rem;
  display: flex;
  align-items: center;
}

.status-icon {
  color: #25d366; /* WhatsApp green */
  margin-left: 2px;
}

.dark-mode .status-icon {
  color: #00a884; /* Dark mode WhatsApp green */
}

.message-input {
  display: flex;
  padding: 12px;
  background-color: #f0f0f0;
  border-top: 1px solid #e0e0e0;
  position: sticky;
  bottom: 0;
  z-index: 5;
}

.dark-mode .message-input {
  background-color: #0b141a;
  border-top-color: #2a3942;
}

.message-input input {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 20px;
  font-size: 0.875rem;
  background-color: #ffffff;
  color: #111827;
  margin-right: 8px;
}

.dark-mode .message-input input {
  background-color: #1f2a44;
  color: #e0e0e0;
}

.message-input button {
  background: none;
  border: none;
  padding: 10px;
  color: #25d366;
  cursor: pointer;
}

.dark-mode .message-input button {
  color: #00a884;
}

.message-input button:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.no-conversation-selected,
.loading,
.error-message,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1rem;
  color: #6b7280;
}

.dark-mode .no-conversation-selected,
.dark-mode .loading,
.dark-mode .error-message,
.dark-mode .empty-state {
  color: #a3a3a3;
}

.error-message {
  color: #dc2626;
}

.dark-mode .error-message {
  color: #f87171;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
    height: calc(100vh - 120px); /* Adjust for navbar and fixed-bottom */
  }

  .conversations-list {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(0);
    z-index: 20;
  }

  .conversations-list.hide-mobile {
    transform: translateX(-100%);
    display: none; /* Hide when chat is open */
  }

  .conversations-list.show-mobile {
    transform: translateX(0);
    display: block; /* Show by default */
  }

  .chat-window {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(100%);
    z-index: 10;
  }

  .chat-window.show-mobile {
    transform: translateX(0);
    display: block; /* Show when conversation is selected */
  }

  .chat-window.hide-mobile {
    transform: translateX(100%);
    display: none; /* Hide when no conversation is selected */
  }

  .chat-header {
    display: flex;
  }

  .messages {
    max-height: calc(100vh - 200px); /* Adjust for header (60px), input (80px), fixed-bottom (60px) */
  }
}

/* Ensure fixed-bottom stays above chat components */
fixed-bottom {
  z-index: 30;
}

p {
  text-align: right;
}
</style>
```