<template>
  <div :class="['shared-parent', { 'dark-mode': isDark }]">
    <!-- Main Menu -->
    <div class="menu-container" v-if="!showDialog">
      <div class="menu-header">
        <h3 style="color: green;">{{ $t('shared.offerTitle') }}</h3>
      </div>
      <ul class="menu-list">
        <li
            class="menu-item"
            v-for="(item, index) in menuItems"
            :key="index"
            @click="selectCategory(item)"
        >
          <div class="menu-link">
            <span class="icon">{{ item.icon }}</span>
            <span class="text">{{ item.text }}</span>
            <span class="arrow">→</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Confirmation Dialog -->
    <div class="dialog-overlay" v-if="showDialog">
      <div class="dialog-container">
        <h3>{{ $t('shared.agreementTitle') }}
          <br>
          {{ $t('shared.agreementVerse') }}
        </h3>
        <p>{{ $t('shared.selectedCategory') }}: <strong>{{ selectedCategory.text }}</strong></p>

        <div class="checkbox-group">
          <input type="checkbox" id="confirmCheckbox" v-model="isConfirmed">
          <label for="confirmCheckbox">{{ $t('shared.confirmAgreement') }}</label>
        </div>

        <p class="error-message" v-if="showError">{{ $t('shared.errorMessage') }}</p>

        <div class="dialog-buttons">
          <button class="cancel-btn" @click="cancelSelection">{{ $t('shared.cancel') }}</button>
          <button class="continue-btn" @click="handleContinue">{{ $t('shared.continue') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveProductForm, getProductForm } from '@/productFormStorage';

export default {
  name: "addPost",
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuItems: [
        { icon: "🚗", text: "cars", value: "سيارات" },
        { icon: "🚚", text: "building", value: "عقار" },
        { icon: "🚴", text: "devices", value: "devices" },
        { icon: "🏢", text: "jobs", value: "jobs" },
        { icon: "📱", text: "furniture", value: "furniture" },
        { icon: "🐑", text: "personal_accessories", value: "personal_accessories" },
        { icon: "🛒", text: "other", value: "other" },
      ],
      showDialog: false,
      selectedCategory: null,
      isConfirmed: false,
      showError: false
    };
  },
  created() {
    // Translate menu items when component is created
    this.menuItems = this.menuItems.map(item => ({
      ...item,
      text: this.$t(`shared.menu.${item.text}`)
    }));
  },
  methods: {
    selectCategory(item) {
      this.selectedCategory = item;
      this.showDialog = true;
      this.isConfirmed = false;
      this.showError = false;
    },
    handleContinue() {
      if (!this.isConfirmed) {
        this.showError = true;
        return;
      }

      const currentForm = getProductForm() || {};
      saveProductForm({
        ...currentForm,
        category: this.selectedCategory.value,
        categoryDisplay: this.selectedCategory.text
      });
      console.log(this.selectedCategory.value);
      localStorage.setItem('selectedCategory', this.selectedCategory.value);
      this.showDialog = false;
      this.$router.push('/region');
    },
    cancelSelection() {
      this.showDialog = false;
      this.selectedCategory = null;
    }
  }
};
</script>

<style scoped>
/* [Styles remain unchanged, assuming they match sharedComponent.vue] */
.shared-parent {
  font-family: Arial, sans-serif;
  direction: ltr;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.dark-mode {
  background-color: #222;
  color: #fff;
}

.menu-container {
  width: 80vw;
  max-width: 1200px;
  min-width: 80vw;
  background-color: #fff;
  border-radius: 25px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}

.dark-mode .menu-container {
  background-color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
  height: calc((100vh - 40px) / 14);
}

.menu-header h3 {
  font-size: 18px;
  font-weight: bold;
  color: green;
  margin: 0;
}

.dark-mode .menu-header h3 {
  color: #4CAF50;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  color: #333;
  height: calc((100vh - 40px) / 8);
  flex-shrink: 0;
}

.menu-link {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
  padding: 0 10px;
}

.dark-mode .menu-item {
  color: #eee;
}

.menu-item:hover {
  background-color: #f0f0f0;
  border-radius: 5px;
}

.dark-mode .menu-item:hover {
  background-color: #444;
}

.icon {
  margin-left: 10px;
  font-size: 100px;
  width: 100px;
  text-align: center;
  line-height: 1;
}

.dark-mode .icon {
  filter: brightness(0.9);
}

.text {
  flex-grow: 1;
  font-size: 1.2em;
  padding: 0 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  font-size: 100px;
  color: #007bff;
  margin-right: 10px;
  line-height: 1;
}

.dark-mode .arrow {
  color: #4dabf7;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .menu-container { width: 90vw; padding: 30px; height: calc(100vh - 60px); }
  .menu-header { height: calc((100vh - 60px) / 14); }
  .menu-item { height: calc((100vh - 60px) / 8); }
  .icon, .arrow { font-size: 80px; width: 80px; }
}

@media (max-width: 992px) {
  .icon, .arrow { font-size: 60px; width: 60px; }
  .text { font-size: 1.1em; }
}

@media (max-width: 768px) {
  .menu-container { padding: 25px; height: calc(100vh - 50px); }
  .menu-header { height: calc((100vh - 50px) / 14); }
  .menu-item { height: calc((100vh - 50px) / 8); }
  .icon, .arrow { font-size: 50px; width: 50px; }
  .text { font-size: 1em; }
}

@media (max-width: 576px) {
  .menu-container { padding: 20px; border-radius: 15px; height: calc(100vh - 40px); }
  .menu-header { height: calc((100vh - 40px) / 14); }
  .menu-item { height: calc((100vh - 40px) / 8); }
  .icon, .arrow { font-size: 40px; width: 40px; }
  .text { font-size: 0.9em; padding: 0 10px; }
  .menu-header h3 { font-size: 16px; }
}

@media (max-width: 400px) {
  .icon, .arrow { font-size: 30px; width: 30px; }
  .text { font-size: 0.8em; }
}

/* Dialog Styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-container {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dark-mode .dialog-container {
  background-color: #333;
  color: white;
}

.checkbox-group {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.checkbox-group input {
  margin-right: 10px;
}

.error-message {
  color: red;
  margin: 10px 0;
}

.dark-mode .error-message {
  color: #ff6b6b;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn, .continue-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-btn {
  background-color: #f1f1f1;
  color: #333;
}

.dark-mode .cancel-btn {
  background-color: #444;
  color: white;
}

.continue-btn {
  background-color: #4CAF50;
  color: white;
}

.continue-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>