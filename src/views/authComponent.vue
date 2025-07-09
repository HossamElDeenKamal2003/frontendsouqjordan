<template>
  <div class="dialog-overlay" v-if="isVisible">
    <div class="dialog-content">
      <h1>{{ showLoginForm ? $t('auth.login') : $t('auth.register') }}</h1>
sadasd
      <!-- Login Form -->
      <form v-if="showLoginForm" @submit.prevent="submitLoginForm">
        <label for="emailOrPhone">{{ $t('auth.emailOrPhone') }}</label>
        <input
            type="text"
            id="emailOrPhone"
            v-model="emailOrPhone"
            :placeholder="$t('auth.emailOrPhonePlaceholder')"
            required
        />
        <p class="error-message" v-if="loginErrors.emailOrPhone">{{ loginErrors.emailOrPhone }}</p>

        <label for="password">{{ $t('auth.password') }}</label>
        <input
            type="password"
            id="password"
            v-model="password"
            :placeholder="$t('auth.passwordPlaceholder')"
            required
        />
        <p class="error-message" v-if="loginErrors.password">{{ loginErrors.password }}</p>

        <button type="submit">{{ $t('auth.loginButton') }}</button>
      </form>
      <!-- Signup Form -->
      <form v-else @submit.prevent="submitSignupForm">
        <label for="username">{{ $t('auth.username') }}</label>
        <input
            type="text"
            id="username"
            v-model="username"
            :placeholder="$t('auth.usernamePlaceholder')"
            required
        />
        <p class="error-message" v-if="signupErrors.username">{{ signupErrors.username }}</p>

        <label for="email">{{ $t('auth.email') }}</label>
        <input
            type="text"
            id="email"
            v-model="email"
            :placeholder="$t('auth.emailPlaceholder')"
            required
        />
        <p class="error-message" v-if="signupErrors.email">{{ signupErrors.email }}</p>

        <label for="phoneNumber">{{ $t('auth.phoneNumber') }}</label>
        <input
            type="text"
            id="phoneNumber"
            v-model="phoneNumber"
            :placeholder="$t('auth.phoneNumberPlaceholder')"
            required
        />
        <p class="error-message" v-if="signupErrors.phoneNumber">{{ signupErrors.phoneNumber }}</p>

        <label for="password">{{ $t('auth.password') }}</label>
        <input
            type="password"
            id="password"
            v-model="password"
            :placeholder="$t('auth.passwordPlaceholder')"
            required
        />
        <p class="error-message" v-if="signupErrors.password">{{ signupErrors.password }}</p>

        <button type="submit">{{ $t('auth.signupButton') }}</button>
      </form>

      <!-- Close Button -->
      <button class="close-button" @click="$emit('close')">{{ $t('auth.close') }}</button>

      <!-- Toggle Form Link -->
      <span class="switch-link" @click="toggleForm">
        {{ showLoginForm ? $t('auth.switchToSignup') : $t('auth.switchToLogin') }}
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
      this.loginErrors = { emailOrPhone: "", password: "" };

      if (!this.emailOrPhone) {
        this.loginErrors.emailOrPhone = this.$t('auth.loginRequiredEmailOrPhone');
        return;
      }
      if (!this.password) {
        this.loginErrors.password = this.$t('auth.loginRequiredPassword');
        return;
      }

      try {
        const response = await axios.post('https://backend.jordan-souq.com/users/login', {
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
          this.loginErrors.password = this.$t('auth.loginIncorrect');
        } else {
          alert(this.$t('auth.loginError'));
        }
      }
    },
    async submitSignupForm() {
      this.signupErrors = { username: "", email: "", phoneNumber: "", password: "" };

      if (!this.username) {
        this.signupErrors.username = this.$t('auth.signupRequiredUsername');
        return;
      }
      if (!this.email) {
        this.signupErrors.email = this.$t('auth.signupRequiredEmail');
        return;
      }
      if (!this.phoneNumber) {
        this.signupErrors.phoneNumber = this.$t('auth.signupRequiredPhoneNumber');
        return;
      }
      if (!this.password) {
        this.signupErrors.password = this.$t('auth.signupRequiredPassword');
        return;
      }

      try {
        const response = await axios.post('https://backend.jordan-souq.com/users/register', {
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
            this.signupErrors.email = this.$t('auth.signupExists');
          } else {
            alert(error.response.data.message);
          }
        } else {
          alert(this.$t('auth.signupError'));
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
  width: 400px;
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
  margin-bottom: 5px;
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