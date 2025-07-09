<template>
  <div :class="[localIsDark ? 'full-height-container-dark' : 'full-height-container', { 'dark-mode': localIsDark, 'rtl-direction': isRTL }]">
    <div class="container shared-parent">
      <h2 class="main-title">{{ $t('landOffer.title') }}</h2>
      <div class="form">
        <!-- Image Upload Component -->
        <ImageUpload :isDark="localIsDark" v-model:images="images" />

        <!-- Title Input -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.titleLabel') }}</label>
            <input
                type="text"
                v-model="title"
                class="form-input"
                :placeholder="$t('landOffer.enterTitle')"
                :aria-label="$t('landOffer.titleLabel')"
            />
          </div>
        </div>

        <!-- Price Input -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.price') }}</label>
            <input
                type="number"
                v-model="price"
                class="form-input"
                :placeholder="$t('landOffer.enterPrice')"
                min="0"
                :aria-label="$t('landOffer.price')"
            />
          </div>
        </div>

        <!-- Residential or Commercial -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.landType') }}</label>
            <div class="radio-group">
              <label>
                <input type="radio" v-model="landType" value="residential" /> {{ $t('landOffer.residential') }}
              </label>
              <label>
                <input type="radio" v-model="landType" value="commercial" /> {{ $t('landOffer.commercial') }}
              </label>
            </div>
          </div>
        </div>

        <!-- Space of Land -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.space') }}</label>
            <div class="input-with-select">
              <input type="number" v-model.number="landSpace" class="form-input" :placeholder="$t('landOffer.enterSpace')" />
              <select v-model="spaceUnit" class="form-select">
                <option value="m2">{{ $t('landOffer.m2') }}</option>
                <option value="m3">{{ $t('landOffer.m3') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Owner or Mediator -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.sellerType') }}</label>
            <div class="radio-group">
              <label>
                <input type="radio" v-model="sellerType" value="owner" /> {{ $t('landOffer.owner') }}
              </label>
              <label>
                <input type="radio" v-model="sellerType" value="mediator" /> {{ $t('landOffer.mediator') }}
              </label>
            </div>
          </div>
        </div>

        <!-- Tenant Toggle -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.isTenant') }}</label>
            <div class="toggle-container">
              <input type="checkbox" v-model="isTenant" id="tenantToggle" class="toggle-input" />
              <label for="tenantToggle" class="toggle-label"></label>
            </div>
          </div>
        </div>

        <!-- Near Places -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.nearPlaces') }}</label>
            <div class="btns-container">
              <div
                  v-for="place in nearPlaces"
                  :key="place"
                  class="btns"
                  :tabindex="0"
                  :class="{ selected: selectedPlaces.includes(place) }"
                  @click="togglePlace(place)"
              >
                {{ $t(`landOffer.places.${place}`) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Direction -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.direction') }}</label>
            <div class="radio-group">
              <label>
                <input type="radio" v-model="direction" value="north" /> {{ $t('landOffer.north') }}
              </label>
              <label>
                <input type="radio" v-model="direction" value="south" /> {{ $t('landOffer.south') }}
              </label>
            </div>
          </div>
        </div>

        <!-- Number of Offer Circle Buildings -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.offerCircleBuildings') }}</label>
            <input type="number" v-model.number="offerCircleBuildings" class="form-input" :placeholder="$t('landOffer.enterNumber')" />
          </div>
        </div>

        <!-- Description Input -->
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('landOffer.description') }}</label>
            <textarea
                v-model="description"
                class="form-input form-textarea"
                :placeholder="$t('landOffer.enterDescription')"
                :aria-label="$t('landOffer.description')"
            ></textarea>
          </div>
        </div>

        <!-- Submit Offer Button -->
        <div class="spec-row">
          <div class="spec-item">
            <button class="submit-btn" @click="handleSubmit" :disabled="isSubmitting">
              {{ isSubmitting ? $t('landOffer.loading') : $t('landOffer.submit') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageUpload from '@/components/addpost/ImageUpload.vue';
import axios from 'axios';

export default {
  name: 'LandsComponent',
  components: {
    ImageUpload,
  },
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
    isRTL: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      localIsDark: this.isDark,
      title: '',
      price: 0,
      description: '',
      landType: '',
      landSpace: '',
      spaceUnit: 'm2',
      sellerType: '',
      isTenant: false,
      nearPlaces: ['Market', 'School', 'Park', 'Mosque', 'CarsParking', 'Bank', 'Hospital', 'Gum', 'Restaurant'],
      selectedPlaces: [],
      direction: '',
      offerCircleBuildings: 0,
      images: [],
      metaCategory: 'land', // Default metaCategory
      isSubmitting: false,
      baseUrl: 'https://backend.jordan-souq.com',
    };
  },
  watch: {
    isDark(newVal) {
      this.localIsDark = newVal;
    },
  },
  created() {
    // Set metaCategory from type prop or localStorage
    if (this.type) {
      this.metaCategory = this.type.toLowerCase();
    } else {
      const storedType = localStorage.getItem('selectedBuildingType');
      if (storedType) {
        this.metaCategory = storedType.toLowerCase();
        console.log('Loaded metaCategory:', this.metaCategory);
      } else {
        console.warn('No type prop or stored type, defaulting to "land"');
      }
    }
    console.log('metaCategory:', this.metaCategory);
  },
  methods: {
    togglePlace(place) {
      const index = this.selectedPlaces.indexOf(place);
      if (index === -1) {
        this.selectedPlaces.push(place);
      } else {
        this.selectedPlaces.splice(index, 1);
      }
    },
    async handleSubmit() {
      // Comprehensive validation
      if (!this.title.trim()) {
        alert(this.$t('landOffer.validation.title'));
        return;
      }
      if (this.price <= 0) {
        alert(this.$t('landOffer.validation.price'));
        return;
      }
      if (!this.description.trim()) {
        alert(this.$t('landOffer.validation.description'));
        return;
      }
      if (!this.landType) {
        alert(this.$t('landOffer.validation.landType'));
        return;
      }
      if (!this.landSpace || this.landSpace <= 0) {
        alert(this.$t('landOffer.validation.landSpace'));
        return;
      }
      if (!this.sellerType) {
        alert(this.$t('landOffer.validation.sellerType'));
        return;
      }
      if (!this.metaCategory) {
        alert(this.$t('landOffer.validation.metaCategory'));
        return;
      }
      if (this.images.length === 0) {
        alert(this.$t('landOffer.validation.images'));
        return;
      }
      if (this.selectedPlaces.length === 0) {
        alert(this.$t('landOffer.validation.nearPlaces'));
        return;
      }
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert(this.$t('landOffer.validation.userId'));
        return;
      }

      this.isSubmitting = true;
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('price', this.price.toString());
      formData.append('description', this.description);
      formData.append('content', this.description); // Required by backend
      formData.append('landTo', this.landType);
      formData.append('spaceLand', this.landSpace.toString());
      formData.append('unit', this.spaceUnit);
      formData.append('owner', this.sellerType);
      formData.append('marhon', this.isTenant ? 'true' : 'false');
      formData.append('nearTo', JSON.stringify(this.selectedPlaces));
      formData.append('direction', this.direction || '');
      formData.append('adNumber', this.offerCircleBuildings.toString());
      this.images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });
      formData.append('metaCategory', this.metaCategory.toLowerCase());
      formData.append('category', 'عقار');
      formData.append('userId', userId);

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      try {
        const response = await axios.post(`${this.baseUrl}/product/create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Response:', response.data);
        alert(this.$t('landOffer.success'));
        this.resetForm();
        this.$router.push('/');
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('Error submitting form:', {
          message: errorMessage,
          status: error.response?.status,
          data: error.response?.data,
        });
        alert(`${this.$t('landOffer.error')}: ${errorMessage}`);
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.title = '';
      this.price = 0;
      this.description = '';
      this.landType = '';
      this.landSpace = '';
      this.spaceUnit = 'm2';
      this.sellerType = '';
      this.isTenant = false;
      this.selectedPlaces = [];
      this.direction = '';
      this.offerCircleBuildings = 0;
      this.images = [];
      // Do not reset metaCategory
    },
  },
};
</script>

<style scoped>
.full-height-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  transition: all 0.3s ease;
}

.full-height-container-dark {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a !important;
  font-family: Arial, sans-serif;
  transition: all 0.3s ease;
}

.container {
  flex: 1;
  padding: 20px;
  width: 80vw;
  margin: 0 auto;
}

.shared-parent {
  border-radius: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  width: 80vw;
  transition: background-color 0.3s ease;
}

.dark-mode .shared-parent {
  background-color: #2d2d2d !important;
}

.main-title {
  color: #4CAF50;
  margin-bottom: 20px;
}

.form {
  flex: 1;
}

.spec-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.spec-item {
  flex: 1;
  min-width: 200px;
}

.spec-item label {
  color: #333;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

.dark-mode .spec-item label {
  color: #e0e0e0 !important;
}

.radio-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.radio-group label {
  display: flex;
  align-items: center;
  color: #333;
}

.dark-mode .radio-group label {
  color: #e0e0e0 !important;
}

.radio-group input {
  margin-right: 8px;
}

.input-with-select {
  display: flex;
  gap: 10px;
}

.input-with-select .form-input {
  flex: 1;
}

.input-with-select .form-select {
  width: 80px;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.toggle-input {
  display: none;
}

.toggle-label {
  display: inline-block;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-label::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.toggle-input:checked + .toggle-label {
  background-color: #4CAF50;
}

.toggle-input:checked + .toggle-label::after {
  transform: translateX(20px);
}

.dark-mode .toggle-label {
  background-color: #555 !important;
}

.dark-mode .toggle-label::after {
  background-color: #3a3a3a !important;
}

.dark-mode .toggle-input:checked + .toggle-label {
  background-color: #66bb6a !important;
}

.btns-container {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: center;
}

.btns {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
  outline: none;
}

.dark-mode .btns {
  background-color: #3a3a3a !important;
  color: #fff !important;
}

.btns:hover {
  background-color: #d0d0d0;
}

.dark-mode .btns:hover {
  background-color: #444 !important;
}

.btns:focus {
  outline: 2px solid #4CAF50;
}

.selected {
  background-color: green !important;
}

.dark-mode .selected {
  background-color: green !important;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  transition: all 0.3s ease;
  font-size: 14px;
  margin-bottom: 15px;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  transition: all 0.3s ease;
  font-size: 14px;
  margin-bottom: 15px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  padding-right: 30px;
}

.dark-mode .form-input,
.dark-mode .form-textarea,
.dark-mode .form-select {
  background-color: #3a3a3a !important;
  border-color: #555 !important;
  color: #ffffff !important;
}

.dark-mode .form-select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e0e0e0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important;
}

.submit-btn {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  width: 100%;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.dark-mode .submit-btn {
  background-color: #66bb6a !important;
}

.dark-mode .submit-btn:hover {
  background-color: #558b2f !important;
}

.rtl-direction .spec-row {
  flex-direction: row-reverse;
}

[dir="rtl"] .btns-container,
[dir="rtl"] .radio-group,
[dir="rtl"] .input-with-select {
  flex-direction: row-reverse;
}

[dir="rtl"] .form-select {
  background-position: left 10px center;
  padding-right: 10px;
  padding-left: 30px;
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
    width: 90vw;
  }

  .shared-parent {
    width: 90vw;
  }

  .spec-row {
    flex-direction: column;
    gap: 15px;
  }

  .spec-item {
    min-width: 100%;
  }

  .btns {
    padding: 8px 15px;
  }

  .form-input,
  .form-textarea,
  .form-select {
    padding: 8px;
  }

  .submit-btn {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
    width: 95vw;
  }

  .shared-parent {
    width: 95vw;
  }

  .btns {
    padding: 6px 12px;
    font-size: 13px;
  }

  .form-input,
  .form-textarea,
  .form-select {
    padding: 6px;
    font-size: 13px;
  }

  .submit-btn {
    padding: 8px;
  }
}

.radio-group {
  justify-content: center;
}

.toggle-container {
  justify-content: center;
}
</style>