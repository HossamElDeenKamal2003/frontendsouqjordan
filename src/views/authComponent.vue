<template>
  <div class="dialog-overlay" v-if="isVisible">
    <div class="dialog-content">
      <h1>{{ showLoginForm ? 'Login' : 'Register' }}</h1>

      <!-- Login Form -->
      <form v-if="showLoginForm" @submit.prevent="submitLoginForm">
        <label for="emailOrPhone">Email or Phone Number</label>
        <input type="text" id="emailOrPhone" v-model="emailOrPhone" placeholder="Enter your email or phone number" required />
        <p class="error-message" v-if="loginErrors.emailOrPhone">{{ loginErrors.emailOrPhone }}</p>

        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
        <p class="error-message" v-if="loginErrors.password">{{ loginErrors.password }}</p>

        <button type="submit">Login</button>
      </form>

      <!-- Signup Form -->
      <form v-else @submit.prevent="submitSignupForm">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" placeholder="Enter your username" required />
        <p class="error-message" v-if="signupErrors.username">{{ signupErrors.username }}</p>

        <label for="email">Email</label>
        <input type="text" id="email" v-model="email" placeholder="Enter your email" required />
        <p class="error-message" v-if="signupErrors.email">{{ signupErrors.email }}</p>

        <label for="phoneNumber">Phone Number</label>
        <input type="text" id="phoneNumber" v-model="phoneNumber" placeholder="Enter your phone number" required />
        <p class="error-message" v-if="signupErrors.phoneNumber">{{ signupErrors.phoneNumber }}</p>

        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
        <p class="error-message" v-if="signupErrors.password">{{ signupErrors.password }}</p>

        <button type="submit">Sign Up</button>
      </form>

      <!-- Close Button -->
      <button class="close-button" @click="$emit('close')">Close</button>

      <!-- Toggle Form Link -->
      <span class="switch-link" @click="toggleForm">
                {{ showLoginForm ? 'Don’t have an account? Sign up here' : 'Already have an account? Login here' }}
            </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "AuthComponent",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showLoginForm: true,
      emailOrPhone: "",
      password: "",
      email: "",
      phoneNumber: "",
      username: "",
      loginErrors: {
        emailOrPhone: "",
        password: "",
      },
      signupErrors: {
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
      },
    };
  },
  methods: {
    async submitLoginForm() {
      this.loginErrors = { emailOrPhone: "", password: "" }; // Reset errors

      if (!this.emailOrPhone) {
        this.loginErrors.emailOrPhone = "Email or phone number is required.";
        return;
      }
      if (!this.password) {
        this.loginErrors.password = "Password is required.";
        return;
      }

      try {
        const response = await axios.post('https://heraj-backend.onrender.com/users/login', {
          emailOrPhone: this.emailOrPhone,
          password: this.password,
        });
        localStorage.setItem('id', response.data.user._id);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('phoneNumber', response.data.user.phoneNumber);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('password', response.data.user.password);
        this.$emit("close");
        window.location.href = "/";
      } catch (error) {
        if (error.response?.status === 400) {
          this.loginErrors.password = "Incorrect email, phone number, or password.";
        } else {
          alert("An error occurred during login.");
        }
      }
    },
    async submitSignupForm() {
      this.signupErrors = { username: "", email: "", phoneNumber: "", password: "" }; // Reset errors

      if (!this.username) {
        this.signupErrors.username = "Username is required.";
        return;
      }
      if (!this.email) {
        this.signupErrors.email = "Email is required.";
        return;
      }
      if (!this.phoneNumber) {
        this.signupErrors.phoneNumber = "Phone number is required.";
        return;
      }
      if (!this.password) {
        this.signupErrors.password = "Password is required.";
        return;
      }

      try {
        const response = await axios.post('https://heraj-backend.onrender.com/users/register', {
          email: this.email,
          phoneNumber: this.phoneNumber,
          password: this.password,
          username: this.username,
        });
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('phoneNumber', response.data.user.phoneNumber);
        this.$emit("close");
        window.location.href = "/";
      } catch (error) {
        if (error.response?.status === 400) {
          if (error.response.data.message === "Email or Phone number already exists") {
            this.signupErrors.email = "Email or phone number already exists.";
          } else {
            alert(error.response.data.message);
          }
        } else {
          alert("An error occurred during signup.");
        }
      }
    },
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
      this.clearFields();
    },
    clearFields() {
      this.emailOrPhone = "";
      this.password = "";
      this.email = "";
      this.phoneNumber = "";
      this.username = "";
      this.loginErrors = { emailOrPhone: "", password: "" };
      this.signupErrors = { username: "", email: "", phoneNumber: "", password: "" };
    },
  },
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px; /* Increased width */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  margin-bottom: 5px; /* Reduced margin to accommodate error messages */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

.close-button {
  background-color: #f44336;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  width: 100%;
}

.close-button:hover {
  background-color: #d32f2f;
}

.switch-link {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: #007BFF;
  text-align: center;
  cursor: pointer;
  text-decoration: underline;
}

.switch-link:hover {
  color: #0056b3;
}
</style>