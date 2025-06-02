<template>
  <nav class="bottom-navbar" :class="{ 'rtl': $i18n.locale === 'ar' }">
    <!-- Show Login/Register button if not logged in, otherwise show user info -->
    <div v-if="!isLoggedIn" class="auth-section">
      <button @click="openDialog" class="auth-button">{{ $t('auth.login_register') }}</button>
    </div>
    <div v-else class="user-section">
      <span class="username" @click="navigateToProfile">
        <i class="fas fa-user"></i> {{ loggedInUsername }}
      </span>
      <button @click="handleSignOut" class="signout-button" :title="$t('auth.sign_out')">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

    <div class="brand">
      <img src="../assets/main logo.jpeg" alt="Main Logo" class="logo" />
    </div>

    <div class="icons">
      <button @click="toggleLanguage" class="language-toggle" :title="$t(`language.switch_to_${$i18n.locale === 'en' ? 'arabic' : 'english'}`)">
        <span :style="{ color: 'white' }">{{ $i18n.locale.toUpperCase() }}</span>
        <i :class="$i18n.locale === 'en' ? 'fas fa-flag-usa' : 'fas fa-globe'"></i>
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
          <button @click="activeForm = 'login'" :class="{ active: activeForm === 'login' }">{{ $t('auth.login') }}</button>
          <button @click="activeForm = 'register'" :class="{ active: activeForm === 'register' }">{{ $t('auth.register') }}</button>
        </div>

        <!-- Login Form -->
        <form v-if="activeForm === 'login'" @submit.prevent="handleLogin">
          <div class="input-group">
            <input type="text" v-model="loginEmailOrPhone" :placeholder="$t('auth.email_or_phone')" required />
            <p class="error-message" v-if="loginErrors.emailOrPhone">{{ $t(`auth.errors.${loginErrors.emailOrPhone}`) }}</p>
          </div>
          <div class="input-group">
            <input type="password" v-model="loginPassword" :placeholder="$t('auth.password')" required />
            <p class="error-message" v-if="loginErrors.password">{{ $t(`auth.errors.${loginErrors.password}`) }}</p>
          </div>
          <button type="submit">{{ $t('auth.login') }}</button>
        </form>

        <!-- Register Form -->
        <form v-if="activeForm === 'register'" @submit.prevent="handleSignup">
          <div class="input-group">
            <input type="text" v-model="registerUsername" :placeholder="$t('auth.username')" required />
            <p class="error-message" v-if="registerErrors.username">{{ $t(`auth.errors.${registerErrors.username}`) }}</p>
          </div>
          <div class="input-group">
            <input type="email" v-model="registerEmail" :placeholder="$t('auth.email')" required />
            <p class="error-message" v-if="registerErrors.email">{{ $t(`auth.errors.${registerErrors.email}`) }}</p>
          </div>
          <div class="input-group">
            <input type="text" v-model="registerPhoneNumber" :placeholder="$t('auth.phone_number')" required />
            <p class="error-message" v-if="registerErrors.phoneNumber">{{ $t(`auth.errors.${registerErrors.phoneNumber}`) }}</p>
          </div>
          <div class="input-group">
            <input type="password" v-model="registerPassword" :placeholder="$t('auth.password')" required />
            <p class="error-message" v-if="registerErrors.password">{{ $t(`auth.errors.${registerErrors.password}`) }}</p>
          </div>
          <button type="submit">{{ $t('auth.register') }}</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';

export default {
  name: 'BottomNavbar',
  props: {
    isDark: Boolean,
  },
  data() {
    return {
      isDialogOpen: false,
      activeForm: 'login',
      loginEmailOrPhone: '',
      loginPassword: '',
      loginErrors: { emailOrPhone: '', password: '' },
      registerUsername: '',
      registerEmail: '',
      registerPhoneNumber: '',
      registerPassword: '',
      registerErrors: { username: '', email: '', phoneNumber: '', password: '' },
      isLoggedIn: false,
      loggedInUsername: '',
    };
  },
  created() {
    this.checkLoginStatus();
    if (this.$i18n) {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage) {
        this.$i18n.locale = storedLanguage;
        document.documentElement.setAttribute('dir', storedLanguage === 'ar' ? 'rtl' : 'ltr');
      }
    }
  },
  methods: {
    toastError() {
      toast.error('Please login to access this feature', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: this.isDark ? 'dark' : 'light',
        rtl: this.$i18n.locale === 'ar', // Set RTL based on locale
      });
    },
    toastSuccess() {
      toast.success('Your Offer Created Successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: this.isDark ? 'dark' : 'light',
        rtl: this.$i18n.locale === 'ar', // Set RTL based on locale
      });
    },
    checkLoginStatus() {
      const username = localStorage.getItem('username');
      if (username) {
        this.isLoggedIn = true;
        this.loggedInUsername = username;
      } else {
        this.isLoggedIn = false;
        this.loggedInUsername = '';
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
      if (this.$i18n) {
        const newLocale = this.$i18n.locale === 'en' ? 'ar' : 'en';
        this.$i18n.locale = newLocale;
        localStorage.setItem('language', newLocale);
        document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr');
      }
    },
    toggleTheme() {
      this.$emit('toggle-theme');
    },
    navigateToProfile() {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.$router.push(`/profile/${userId}`);
      } else {
        this.toastError(); // Use toastError for unauthenticated access
      }
    },
    async handleLogin() {
      this.loginErrors = { emailOrPhone: '', password: '' };
      if (!this.loginEmailOrPhone) {
        this.loginErrors.emailOrPhone = 'email_or_phone_required';
        return;
      }
      if (!this.loginPassword) {
        this.loginErrors.password = 'password_required';
        return;
      }
      const isEmail = /\S+@\S+\.\S+/.test(this.loginEmailOrPhone);
      const payload = { password: this.loginPassword };
      if (isEmail) payload.email = this.loginEmailOrPhone;
      else payload.phoneNumber = this.loginEmailOrPhone;
      try {
        const response = await axios.post('https://backend.jordan-souq.com/users/login', payload);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('phoneNumber', response.data.user.phoneNumber);
        localStorage.setItem('username', response.data.user.username || '');
        this.checkLoginStatus();
        this.closeDialog();
        window.location.href = '/';
      } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
          switch (error.response.status) {
            case 400:
              this.loginErrors.emailOrPhone = 'email_or_phone_password_required';
              break;
            case 401:
              this.loginErrors[error.response.data.message === 'User not found' ? 'emailOrPhone' : 'password'] =
                  error.response.data.message.toLowerCase().replace(' ', '_');
              break;
            case 500:
              this.loginErrors.password = 'internal_server_error';
              break;
            default:
              this.loginErrors.password = 'login_error';
          }
        } else {
          this.loginErrors.password = 'network_error';
        }
      }
    },
    async handleSignup() {
      this.registerErrors = { username: '', email: '', phoneNumber: '', password: '' };
      if (!this.registerUsername) this.registerErrors.username = 'username_required';
      if (!this.registerEmail) this.registerErrors.email = 'email_required';
      if (!this.registerPhoneNumber) this.registerErrors.phoneNumber = 'phone_number_required';
      if (!this.registerPassword) this.registerErrors.password = 'password_required';
      if (Object.values(this.registerErrors).some((error) => error)) return;
      try {
        const response = await axios.post('https://heraj-backend.onrender.com/users/register', {
          username: this.registerUsername,
          email: this.registerEmail,
          phoneNumber: this.registerPhoneNumber,
          password: this.registerPassword,
        });
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('phoneNumber', response.data.user.phoneNumber);
        localStorage.setItem('username', response.data.user.username);
        this.checkLoginStatus();
        this.closeDialog();
        window.location.href = '/';
      } catch (error) {
        console.error('Signup error:', error);
        if (error.response && error.response.status === 400) {
          if (error.response.data.message === 'Email or Phone number already exists') {
            this.registerErrors.email = 'email_phone_exists';
            this.registerErrors.phoneNumber = 'email_phone_exists';
          } else {
            this.registerErrors.password = 'registration_error';
          }
        } else {
          this.registerErrors.password = 'network_error';
        }
      }
    },
    handleSignOut() {
      localStorage.clear();
      this.checkLoginStatus();
      window.location.href = '/';
    },
    resetForms() {
      this.loginEmailOrPhone = '';
      this.loginPassword = '';
      this.loginErrors = { emailOrPhone: '', password: '' };
      this.registerUsername = '';
      this.registerEmail = '';
      this.registerPhoneNumber = '';
      this.registerPassword = '';
      this.registerErrors = { username: '', email: '', phoneNumber: '', password: '' };
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

.rtl {
  direction: rtl;
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
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.language-toggle:hover {
  background-color: #f0f0f0;
}

.language-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.language-toggle i {
  font-size: 20px;
}

.language-toggle span {
  font-size: 12px;
  font-weight: 500;
}
</style>