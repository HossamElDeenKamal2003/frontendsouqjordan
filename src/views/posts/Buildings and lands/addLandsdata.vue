<template>
  <div :class="[localIsDark ? 'full-height-container-dark' : 'full-height-container', { 'dark-mode': localIsDark, 'rtl-direction': isRTL }]">
    <div class="container shared-parent">
      <h2 class="main-title">{{ $t('landOffer.title') }}</h2>
      <div class="form">
        <!-- Image Upload Component -->
        <ImageUpload :isDark="localIsDark" v-model:images="images" />

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

        <!-- Submit Offer Button -->
        <div class="spec-row">
          <div class="spec-item">
            <button class="submit-btn" @click="handleSubmit">{{ $t('landOffer.submit') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageUpload from '@/components/addpost/ImageUpload.vue';

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
  },
  data() {
    return {
      localIsDark: false, // Local state for testing dark mode toggle
      landType: '',
      landSpace: '',
      spaceUnit: 'm2',
      sellerType: '',
      isTenant: false,
      nearPlaces: ['Market', 'School', 'Park', 'Mosque', 'CarsParking', 'Bank', 'Hospital', 'Gum', 'Restaurant'],
      selectedPlaces: [],
      direction: '',
      offerCircleBuildings: '',
      images: [], // Track uploaded images
    };
  },
  methods: {
    toggleDarkMode() {
      this.localIsDark = !this.localIsDark;
    },
    togglePlace(place) {
      const index = this.selectedPlaces.indexOf(place);
      if (index === -1) {
        this.selectedPlaces.push(place);
      } else {
        this.selectedPlaces.splice(index, 1);
      }
    },
    handleSubmit() {
      // Basic validation
      if (!this.landType) {
        alert(this.$t('landOffer.validation.landType'));
        return;
      }
      if (!this.landSpace) {
        alert(this.$t('landOffer.validation.landSpace'));
        return;
      }
      if (!this.sellerType) {
        alert(this.$t('landOffer.validation.sellerType'));
        return;
      }
      if (this.images.length === 0) {
        alert(this.$t('landOffer.validation.images'));
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('landType', this.landType);
      formData.append('landSpace', this.landSpace);
      formData.append('spaceUnit', this.spaceUnit);
      formData.append('sellerType', this.sellerType);
      formData.append('isTenant', this.isTenant);
      formData.append('nearPlaces', this.selectedPlaces.join(','));
      formData.append('direction', this.direction);
      formData.append('offerCircleBuildings', this.offerCircleBuildings || 0);
      this.images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });

      // Placeholder for API call (replace with actual endpoint)
      console.log('Form Data:', Object.fromEntries(formData));
      // Example API call (uncomment and adjust as needed)
      // axios.post('https://your-api-endpoint.com/land', formData)
      //   .then(response => {
      //     console.log('Success:', response.data);
      //     alert(this.$t('landOffer.success'));
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //     alert(this.$t('landOffer.error'));
      //   });

      // Reset form after submission (optional)
      this.resetForm();
    },
    resetForm() {
      this.landType = '';
      this.landSpace = '';
      this.spaceUnit = 'm2';
      this.sellerType = '';
      this.isTenant = false;
      this.selectedPlaces = [];
      this.direction = '';
      this.offerCircleBuildings = '';
      this.images = [];
    },
  },
};
</script>

<style scoped>
/* [Previous styles remain unchanged] */
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
  .form-select {
    padding: 6px;
    font-size: 13px;
  }

  .submit-btn {
    padding: 8px;
  }
}
.radio-group{
  justify-content: center;
}

.toggle-container{
  justify-content: center;
}
</style>