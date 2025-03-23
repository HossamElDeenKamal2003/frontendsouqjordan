<template>
  <div :class="['chat-container', { 'dark-mode': isDark }]">
    <!-- Conversations List -->
    <div class="conversations-list">
      <h3>Conversations</h3>
      <ul>
        <li
            v-for="conversation in conversations"
            :key="conversation.conversationId"
            @click="selectConversation(conversation.conversationId)"
            :class="{ active: selectedConversationId === conversation.conversationId }"
        >
          <div class="conversation-info">
            <span>{{ getConversationName(conversation) }}</span>
            <p v-if="conversation.lastMessage">
              {{ conversation.lastMessage.text }}
            </p>
          </div>
        </li>
      </ul>
    </div>

    <!-- Chat Window -->
    <div class="chat-window">
      <div v-if="selectedConversationId">
        <div class="messages">
          <div
              v-for="message in messages"
              :key="message._id"
              :class="['message', message.senderId === userId ? 'sent' : 'received']"
          >
            <div class="message-content">
              <p>{{ message.text }}</p>
              <span class="timestamp">{{ formatTimestamp(message.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="message-input">
          <input
              v-model="newMessage"
              placeholder="Type a message..."
              @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">Send</button>
        </div>
      </div>
      <div v-else class="no-conversation-selected">
        <p>Select a conversation to start chatting.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";

export default {
  name: "Chat",
  props: {
    isDark: Boolean,
  },
  data() {
    return {
      socket: null, // Socket.IO instance
      conversations: [], // List of conversations
      selectedConversationId: null, // Currently selected conversation
      messages: [], // Messages for the selected conversation
      newMessage: "", // New message input
      userId: localStorage.getItem("userId"), // Current user ID
    };
  },
  async created() {
    // Initialize Socket.IO connection
    this.socket = io("https://backend.jordan-souq.com");

    // Fetch conversations for the current user
    await this.fetchConversations();

    // Listen for new messages
    this.socket.on(`newMessage/${this.userId}`, (message) => {
      if (message.conversationId === this.selectedConversationId) {
        this.messages.push(message);
      }
    });
  },
  methods: {
    // Fetch conversations for the current user
    async fetchConversations() {
      try {
        const response = await axios.get(
            `https://backend.jordan-souq.com/api/conversations/${this.userId}`
        );
        this.conversations = response.data.conversations;
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    },

    // Select a conversation and fetch its messages
    async selectConversation(conversationId) {
      this.selectedConversationId = conversationId;
      try {
        const response = await axios.get(
            `https://backend.jordan-souq.com/api/conversations/getAllMessages/${conversationId}`
        );
        this.messages = response.data.messages;
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },

    // Send a new message
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      try {
        const response = await axios.post(
            `https://backend.jordan-souq.com/api/conversations/sendMessage/${this.selectedConversationId}`,
            {
              sender: this.userId,
              text: this.newMessage,
              receiverId: this.getReceiverId(), // Get the receiver ID from the conversation
            }
        );

        // Add the new message to the messages list
        this.messages.push(response.data.messageData);

        // Clear the input
        this.newMessage = "";
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },

    // Get the receiver ID for the selected conversation
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

    // Get the conversation name (for display)
    getConversationName(conversation) {
      if (conversation.name) return conversation.name;
      const otherUser = conversation.participants.find(
          (p) => p.user !== this.userId
      );
      return otherUser ? otherUser.username : "Unknown";
    },

    // Format timestamp for display
    formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },
  },
  beforeDestroy() {
    // Disconnect Socket.IO when the component is destroyed
    if (this.socket) this.socket.disconnect();
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 80vh;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.dark-mode .chat-container {
  background-color: #333;
  color: #fff;
}

.conversations-list {
  width: 30%;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 10px;
}

.dark-mode .conversations-list {
  border-right-color: #555;
}

.conversations-list h3 {
  margin-bottom: 10px;
}

.conversations-list ul {
  list-style: none;
  padding: 0;
}

.conversations-list li {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 5px;
}

.conversations-list li.active {
  background-color: #f0f0f0;
}

.dark-mode .conversations-list li.active {
  background-color: #444;
}

.conversation-info span {
  font-weight: bold;
}

.conversation-info p {
  margin: 5px 0 0;
  color: #666;
}

.dark-mode .conversation-info p {
  color: #ccc;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
}

.message.sent {
  text-align: right;
}

.message.received {
  text-align: left;
}

.message-content {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 70%;
}

.message.sent .message-content {
  background-color: #007bff;
  color: #fff;
}

.message.received .message-content {
  background-color: #f0f0f0;
  color: #333;
}

.dark-mode .message.received .message-content {
  background-color: #444;
  color: #fff;
}

.timestamp {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.dark-mode .timestamp {
  color: #ccc;
}

.message-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.dark-mode .message-input {
  border-top-color: #555;
}

.message-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.dark-mode .message-input input {
  background-color: #444;
  border-color: #555;
  color: #fff;
}

.message-input button {
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message-input button:hover {
  background-color: #0056b3;
}

.no-conversation-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
}

.dark-mode .no-conversation-selected {
  color: #ccc;
}
</style>