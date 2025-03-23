<template>
  <nav class="bottom-navbar">
    <!-- Show Login/Register button if not logged in, otherwise show user info -->
    <div v-if="!isLoggedIn" class="auth-section">
      <button @click="openDialog" class="auth-button">Login / Register</button>
    </div>
    <div v-else class="user-section">
      <!-- Make username clickable -->
      <span class="username" @click="navigateToProfile">
        <i class="fas fa-user"></i> {{ loggedInUsername }}
      </span>
      <button @click="handleSignOut" class="signout-button" title="Sign Out">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

    <div class="brand">
      <img src="../assets/main logo.jpeg" alt="Main Logo" class="logo" />
    </div>

    <div class="icons">
      <!-- Language Toggle Button -->
      <button @click="toggleLanguage" class="language-toggle" :title="isEnglish ? 'Switch to Arabic' : 'Switch to English'">
        <span v-if="isEnglish" style="color: white">EN</span>
        <span v-else style="color: white">AR</span>
        <i :class="isEnglish ? 'fas fa-flag-usa' : 'fas fa-globe'"></i>
      </button>

      <button @click="toggleTheme">
        <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </div>

    <!-- Dialog Backdrop -->
    <div v-if="isDialogOpen" class="dialog-backdrop" @click="closeDialog">
      <div class="dialog" @click.stop>
        <button @click="closeDialog" class="close-button">
          <i class="fas fa-times"></i>
        </button>

        <div class="form-toggle">
          <button @click="activeForm = 'login'" :class="{ active: activeForm === 'login' }">Login</button>
          <button @click="activeForm = 'register'" :class="{ active: activeForm === 'register' }">Register</button>
        </div>

        <!-- Login Form -->
        <form v-if="activeForm === 'login'" @submit.prevent="handleLogin">
          <div class="input-group">
            <input type="text" v-model="loginEmailOrPhone" placeholder="Email or Phone Number" required />
            <p class="error-message" v-if="loginErrors.emailOrPhone">{{ loginErrors.emailOrPhone }}</p>
          </div>
          <div class="input-group">
            <input type="password" v-model="loginPassword" placeholder="Password" required />
            <p class="error-message" v-if="loginErrors.password">{{ loginErrors.password }}</p>
          </div>
          <button type="submit">Login</button>
        </form>

        <!-- Register Form -->
        <form v-if="activeForm === 'register'" @submit.prevent="handleSignup">
          <div class="input-group">
            <input type="text" v-model="registerUsername" placeholder="Username" required />
            <p class="error-message" v-if="registerErrors.username">{{ registerErrors.username }}</p>
          </div>
          <div class="input-group">
            <input type="email" v-model="registerEmail" placeholder="Email" required />
            <p class="error-message" v-if="registerErrors.email">{{ registerErrors.email }}</p>
          </div>
          <div class="input-group">
            <input type="text" v-model="registerPhoneNumber" placeholder="Phone Number" required />
            <p class="error-message" v-if="registerErrors.phoneNumber">{{ registerErrors.phoneNumber }}</p>
          </div>
          <div class="input-group">
            <input type="password" v-model="registerPassword" placeholder="Password" required />
            <p class="error-message" v-if="registerErrors.password">{{ registerErrors.password }}</p>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";

export default {
  name: "BottomNavbar",
  props: {
    isDark: Boolean,
  },
  data() {
    return {
      isDialogOpen: false,
      activeForm: "login",
      isEnglish: localStorage.getItem("language") === "ar" ? false : true, // Load language from localStorage
      // Login form data
      loginEmailOrPhone: "",
      loginPassword: "",
      loginErrors: {
        emailOrPhone: "",
        password: "",
      },

      // Register form data
      registerUsername: "",
      registerEmail: "",
      registerPhoneNumber: "",
      registerPassword: "",
      registerErrors: {
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
      },

      // Logged-in state
      isLoggedIn: false,
      loggedInUsername: "",
    };
  },
  created() {
    this.checkLoginStatus();
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      this.isEnglish = storedLanguage === "en";
    }
  },
  methods: {
    checkLoginStatus() {
      const username = localStorage.getItem("username");
      if (username) {
        this.isLoggedIn = true;
        this.loggedInUsername = username;
      } else {
        this.isLoggedIn = false;
        this.loggedInUsername = "";
      }
    },

    openDialog() {
      this.isDialogOpen = true;
      this.resetForms();
    },
    closeDialog() {
      this.isDialogOpen = false;
      this.resetForms();
    },
    toggleLanguage() {
      this.isEnglish = !this.isEnglish;
      const selectedLanguage = this.isEnglish ? "en" : "ar";
      localStorage.setItem("language", selectedLanguage); // Store language in localStorage
      console.log(this.isEnglish);
    },
    toggleTheme() {
      this.$emit("toggle-theme");
    },

    // Navigate to user profile
    navigateToProfile() {
      const userId = localStorage.getItem("userId");
      if (userId) {
        this.$router.push(`/profile/${userId}`);
      } else {
        console.error("User ID not found in localStorage");
      }
    },

    async handleLogin() {
      this.loginErrors = { emailOrPhone: "", password: "" };

      if (!this.loginEmailOrPhone) {
        this.loginErrors.emailOrPhone = "Email or phone number is required.";
        return;
      }
      if (!this.loginPassword) {
        this.loginErrors.password = "Password is required.";
        return;
      }

      const isEmail = /\S+@\S+\.\S+/.test(this.loginEmailOrPhone);
      const payload = {
        password: this.loginPassword,
      };
      if (isEmail) {
        payload.email = this.loginEmailOrPhone;
      } else {
        payload.phoneNumber = this.loginEmailOrPhone;
      }

      try {
        const response = await axios.post("https://backend.jordan-souq.com/users/login", payload);

        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("phoneNumber", response.data.user.phoneNumber);
        localStorage.setItem("username", response.data.user.username || "");

        this.checkLoginStatus(); // Update login state
        this.closeDialog();
        window.location.href = "/";
      } catch (error) {
        console.error("Login error:", error);
        if (error.response) {
          switch (error.response.status) {
            case 400:
              this.loginErrors.emailOrPhone = "Email or phone number and password are required.";
              break;
            case 401:
              if (error.response.data.message === "User not found") {
                this.loginErrors.emailOrPhone = "User not found.";
              } else if (error.response.data.message === "Incorrect password") {
                this.loginErrors.password = "Incorrect password.";
              }
              break;
            case 500:
              this.loginErrors.password = "Internal server error.";
              break;
            default:
              this.loginErrors.password = "An error occurred during login.";
          }
        } else {
          this.loginErrors.password = "Network error. Please try again.";
        }
      }
    },

    async handleSignup() {
      this.registerErrors = { username: "", email: "", phoneNumber: "", password: "" };

      if (!this.registerUsername) this.registerErrors.username = "Username is required.";
      if (!this.registerEmail) this.registerErrors.email = "Email is required.";
      if (!this.registerPhoneNumber) this.registerErrors.phoneNumber = "Phone number is required.";
      if (!this.registerPassword) this.registerErrors.password = "Password is required.";
      if (Object.values(this.registerErrors).some((error) => error)) return;

      try {
        const response = await axios.post("https://heraj-backend.onrender.com/users/register", {
          username: this.registerUsername,
          email: this.registerEmail,
          phoneNumber: this.registerPhoneNumber,
          password: this.registerPassword,
        });

        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("phoneNumber", response.data.user.phoneNumber);
        localStorage.setItem("username", response.data.user.username);

        this.checkLoginStatus(); // Update login state
        this.closeDialog();
        window.location.href = "/";
      } catch (error) {
        console.error("Signup error:", error);
        if (error.response) {
          if (error.response.status === 400) {
            if (error.response.data.message === "Email or Phone number already exists") {
              this.registerErrors.email = "Email or phone number already exists.";
              this.registerErrors.phoneNumber = "Email or phone number already exists.";
            } else {
              this.registerErrors.password = error.response.data.message;
            }
          } else {
            this.registerErrors.password = "An error occurred during registration.";
          }
        } else {
          this.registerErrors.password = "Network error. Please try again.";
        }
      }
    },

    handleSignOut() {
      localStorage.clear(); // Clear all user data
      this.checkLoginStatus(); // Update login state
      window.location.href = "/"; // Redirect to home
    },

    resetForms() {
      this.loginEmailOrPhone = "";
      this.loginPassword = "";
      this.loginErrors = { emailOrPhone: "", password: "" };

      this.registerUsername = "";
      this.registerEmail = "";
      this.registerPhoneNumber = "";
      this.registerPassword = "";
      this.registerErrors = { username: "", email: "", phoneNumber: "", password: "" };
    },
  },
};
</script>

<style scoped>
.bottom-navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: green;
  padding: 0.75rem 1rem;
  width: 100%;
  z-index: 1000;
  overflow: auto;
}

/* Dark Mode */
.dark-mode .bottom-navbar {
  background-color: #222;
}

/* Logo Styling */
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 120px;
  height: auto;
  max-height: 50px;
  object-fit: contain;
}

/* Auth Section */
.auth-section {
  display: flex;
  align-items: center;
}

.auth-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #fff;
  color: green;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: #fff;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.signout-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
}

.signout-button:hover {
  color: #ddd;
}

/* Icons */
.icons {
  display: flex;
  gap: 1rem;
}

.icons button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.25rem;
  cursor: pointer;
}

/* Dialog Backdrop */
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
  z-index: 2000;
  transition: opacity 0.3s ease;
}

/* Dialog Styles */
.dialog {
  background-color: #fff;
  width: 90%;
  max-width: 600px;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Close Button (X) */
.close-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  padding: 0.5rem;
}

.close-button:hover {
  color: #000;
}

/* Form Toggle Buttons */
.form-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-toggle button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: #333;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

.form-toggle button.active {
  border-bottom: 2px solid green;
  color: green;
}

/* Form Styles */
.dialog form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.dialog input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
}

.dialog button[type="submit"] {
  padding: 0.75rem;
  border: none;
  background-color: green;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.dialog button[type="submit"]:hover {
  background-color: darkgreen;
}

/* Dark Mode Styles */
.dark-mode .dialog {
  background-color: #444;
  color: #fff;
}

.dark-mode .dialog input {
  background-color: #555;
  color: #fff;
  border-color: #666;
}

.dark-mode .form-toggle button {
  color: #fff;
}

.dark-mode .form-toggle button.active {
  color: green;
}

.dark-mode .close-button {
  color: #fff;
}

.dark-mode .close-button:hover {
  color: #ccc;
}
.language-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px; /* Rounded corners */
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.language-toggle:hover {
  background-color: #f0f0f0; /* Light gray on hover */
}

.language-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px; /* Space between icon and text */
}

.language-toggle i {
  font-size: 20px; /* Icon size */
}

.language-toggle span {
  font-size: 12px; /* Text size */
  font-weight: 500; /* Bold text */
}
</style>