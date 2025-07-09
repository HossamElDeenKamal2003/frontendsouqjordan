<template>
  <div :class="[localIsDark ? 'full-height-container-dark' : 'full-height-container', { 'dark-mode': localIsDark }]">
    <div class="container shared-parent">
      <h2 class="main-title">{{ $t('cars.addCarOffer') }}</h2>
      <div class="form">
        <!-- Image Upload Component -->
        <ImageUpload :isDark="localIsDark" v-model:images="data.images" />

        <div class="title-post">
          <h3 class="title">{{ $t('cars.title') }}</h3>
          <input type="text" v-model="data.title" class="form-input" :placeholder="$t('cars.enterCarTitle')" />
        </div>

        <div class="dropDowns">
          <div class="car-form-section">
            <!-- Basic Information -->
            <div class="spec-row">
              <div class="spec-item">
                <label>{{ $t('cars.saleState') }}</label>
                <select v-model="data.saleState" class="form-select">
                  <option value="">{{ $t('cars.selectSaleState') }}</option>
                  <option value="sale">{{ $t('cars.saleStates.sale') }}</option>
                  <option value="transfer">{{ $t('cars.saleStates.transfer') }}</option>
                </select>
              </div>

              <div class="spec-item">
                <label>{{ $t('cars.condition') }}</label>
                <select v-model="data.condition" class="form-select">
                  <option value="">{{ $t('cars.selectCondition') }}</option>
                  <option value="new">{{ $t('cars.conditions.new') }}</option>
                  <option value="used">{{ $t('cars.conditions.used') }}</option>
                </select>
              </div>
            </div>

            <!-- Price -->
            <div class="spec-row">
              <div class="spec-item">
                <label>{{ $t('cars.priceUSD') }}</label>
                <input type="number" v-model="data.price" class="form-input" :placeholder="$t('cars.enterPrice')" />
              </div>
            </div>

            <!-- Car Brand and Model -->
            <div class="spec-row">
              <div class="spec-item">
                <label>{{ $t('cars.carBrand') }}</label>
                <select v-model="data.metaCategory" @change="updateCarModels" class="form-select">
                  <option value="">{{ $t('cars.selectCarBrand') }}</option>
                  <option v-for="brand in carTypes" :value="brand" :key="brand">
                    {{ $t('cars.brands.' + brand) }}
                  </option>
                </select>
                <div v-if="data.metaCategory" class="selected-label">
                  {{ $t('cars.brands.' + data.metaCategory) }}
                </div>
              </div>

              <div class="spec-item">
                <label>{{ $t('cars.model') }}</label>
                <select v-model="data.carType" class="form-select">
                  <option value="">{{ $t('cars.selectModel') }}</option>
                  <option v-for="model in filteredCarModels" :value="model" :key="model">
                    {{ $t('cars.models.' + data.metaCategory + '.' + model) }}
                  </option>
                </select>
                <div v-if="data.carType" class="selected-label">
                  {{ $t('cars.models.' + data.metaCategory + '.' + data.carType) }}
                </div>
              </div>
            </div>

            <!-- Technical Details -->
            <div class="spec-row">
              <div class="spec-item">
                <label>{{ $t('cars.transmission') }}</label>
                <select v-model="data.gearType" class="form-select">
                  <option value="">{{ $t('cars.selectGearType') }}</option>
                  <option value="automatic">{{ $t('cars.gearTypes.automatic') }}</option>
                  <option value="manual">{{ $t('cars.gearTypes.manual') }}</option>
                </select>
              </div>

              <div class="spec-item">
                <label>{{ $t('cars.fuelType') }}</label>
                <select v-model="data.fuelType" class="form-select">
                  <option value="">{{ $t('cars.selectFuelType') }}</option>
                  <option value="gasoline">{{ $t('cars.fuelTypes.gasoline') }}</option>
                  <option value="diesel">{{ $t('cars.fuelTypes.diesel') }}</option>
                  <option value="hybrid">{{ $t('cars.fuelTypes.hybrid') }}</option>
                  <option value="electric">{{ $t('cars.fuelTypes.electric') }}</option>
                </select>
              </div>
            </div>

            <!-- 4WD and Year -->
            <div class="spec-row">
              <div class="spec-item">
                <label>{{ $t('cars.fourWheelDrive') }}</label>
                <select v-model="data.is4WD" class="form-select">
                  <option value="">{{ $t('cars.selectOption') }}</option>
                  <option value="true">{{ $t('cars.options.yes') }}</option>
                  <option value="false">{{ $t('cars.options.no') }}</option>
                </select>
              </div>

              <div class="spec-item">
                <label>{{ $t('cars.year') }}</label>
                <select v-model="data.modelCar" class="form-select">
                  <option value="">{{ $t('cars.selectYear') }}</option>
                  <option v-for="year in years" :value="year" :key="year">{{ year }}</option>
                </select>
              </div>
            </div>

            <!-- Mileage and Rating Progress -->
            <div class="spec-row">
              <div class="spec-item">
                <label>{{ $t('cars.mileageKm') }}</label>
                <div class="progress-container">
                  <input
                      type="range"
                      v-model="data.mileage"
                      min="0"
                      max="300000"
                      step="1000"
                      class="progress-slider"
                  >
                  <div class="progress-info">
                    <span>{{ data.mileage }} {{ $t('cars.km') }}</span>
                    <span>{{ mileagePercentage }}%</span>
                  </div>
                </div>
              </div>

              <div class="spec-item">
                <label>{{ $t('cars.carRating') }}</label>
                <div class="progress-container">
                  <input
                      type="range"
                      v-model="data.carRate"
                      min="1"
                      max="10"
                      step="0.1"
                      class="progress-slider"
                  >
                  <div class="progress-info">
                    <span>{{ data.carRate }}/10</span>
                    <span>{{ $t('cars.ratingText.' + ratingTextKey) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="additional-notes">
              <label>{{ $t('cars.content') }}</label>
              <textarea v-model="data.content" :placeholder="$t('cars.enterCarDescription')" class="form-textarea"></textarea>
            </div>

            <div class="button-container">
              <button class="finish-btn" @click="handleFinish">{{ $t('cars.submitOffer') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveProductForm, getProductForm } from '@/productFormStorage';
import { ConstVariables } from '../../../../const';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import ImageUpload from '@/components/addpost/ImageUpload.vue';

export default {
  name: 'CarsComponent',
  components: {
    ImageUpload,
  },
  data() {
    // Generate years from current year back to 1980
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1980; year--) {
      years.push(year);
    }

    return {
      localIsDark: false,
      data: {
        baseUrl: 'https://backend.jordan-souq.com',
        title: '',
        saleState: '',
        condition: '',
        price: '',
        metaCategory: '',
        carType: '',
        modelCar: '',
        gearType: '',
        fuelType: '',
        is4WD: '',
        year: '',
        mileage: 0,
        carRate: 5,
        content: '',
        userId: '',
        description: '',
        images: [],
      },
      carTypes: [],
      filteredCarModels: [],
      years,
      category: 'cars',
    };
  },
  computed: {
    mileagePercentage() {
      return Math.round((this.data.mileage / 300000) * 100);
    },
    ratingText() {
      const rating = parseFloat(this.data.carRate);
      if (rating < 3) return 'poor';
      if (rating < 5) return 'fair';
      if (rating < 7) return 'good';
      if (rating < 9) return 'veryGood';
      return 'excellent';
    },
    ratingTextKey() {
      return this.ratingText;
    },
    selectedBrandLabel() {
      return this.data.metaCategory ? this.$t('cars.brands.' + this.data.metaCategory) : '';
    },
    selectedModelLabel() {
      return this.data.carType ? this.$t('cars.models.' + this.data.metaCategory + '.' + this.data.carType) : '';
    }
  },
  methods: {
    toggleDarkMode() {
      this.localIsDark = !this.localIsDark;
    },
    toastError(message) {
      toast.error(message || this.$t('cars.loginError'), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: this.localIsDark ? 'dark' : 'light',
      });
    },
    toastSuccess() {
      toast.success(this.$t('cars.successMessage'), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: this.localIsDark ? 'dark' : 'light',
      });
    },
    updateCarModels() {
      this.data.carType = '';
      if (!this.data.metaCategory) {
        this.filteredCarModels = [];
        return;
      }
      const normalizedType = this.data.metaCategory.toLowerCase().replace(/\s+/g, '');
      const modelKey = `${normalizedType}CarModels`;
      // Get models from i18n
      const models = this.$i18n.messages[this.$i18n.locale].cars.models[normalizedType] || {};
      this.filteredCarModels = Object.keys(models);
    },
    async handleFinish() {
      try {
        const formData = new FormData();
        const description = this.data.content || '';

        // Append images
        const imageFiles = this.data.images;
        if (imageFiles.length > 0) {
          for (let i = 0; i < imageFiles.length; i++) {
            formData.append(`image${i + 1}`, imageFiles[i]);
          }
        }

        // Get saved form values from localStorage
        const rawData = localStorage.getItem('productForm');
        const dataForm = rawData ? JSON.parse(rawData) : {};
        const userId = localStorage.getItem('userId');

        // Append other data fields, using English values for metaCategory and carType
        const fieldsToExclude = ['image', 'description', 'content', 'images', 'metaCategory', 'carType'];
        Object.entries(this.data).forEach(([key, value]) => {
          if (!fieldsToExclude.includes(key) && !(value instanceof File)) {
            formData.append(key, value ?? '');
          }
        });

        // Use English values for metaCategory and carType
        const brandLabel = this.data.metaCategory
            ? (this.$i18n.messages['en'].cars.brands[this.data.metaCategory] || '').toLowerCase()
            : '';
        const modelLabel = this.data.carType && this.data.metaCategory
            ? (this.$i18n.messages['en'].cars.models[this.data.metaCategory.toLowerCase().replace(/\s+/g, '')][this.data.carType] || '').toLowerCase()
            : '';
        formData.append('metaCategory', brandLabel);
        formData.append('carType', modelLabel);

        // Append description and other fields
        formData.set('price', parseFloat(this.data.price) || 0);
        formData.set('mileage', parseInt(this.data.mileage) || 0);
        formData.set('carRate', parseFloat(this.data.carRate) || 0);
        formData.set('is4WD', this.data.is4WD === 'true' ? 'true' : 'false');
        formData.set('userId', userId || '');
        formData.set('carModel', this.data.modelCar || '');
        formData.set('description', description);
        formData.set('content', description);
        formData.set('category', 'سيارات');

        // Append extra fields from saved form
        formData.set('Arlocation', dataForm.data?.Arlocation || '');
        formData.set('location', dataForm.data?.location || '');
        formData.set('metaLocation', dataForm.data?.metaLocation || '');

        // Debugging logs
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }

        // API call
        const response = await axios.post(`${this.data.baseUrl}/product/create`, formData);

        if (response.status === 200 || response.status === 201) {
          this.toastSuccess();
          saveProductForm({
            ...this.data,
            description: this.data.content,
            content: this.data.content,
            price: parseFloat(this.data.price) || 0,
            mileage: parseInt(this.data.mileage) || 0,
            carRate: parseFloat(this.data.carRate) || 0,
            is4WD: this.data.is4WD === 'true',
            images: [],
          });
          console.log('Offer submitted:', this.data);
        } else if (response.status === 400) {
          this.toastError(response.data.message);
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        console.error('Submission failed:', error);
        this.toastError(this.$t('cars.submitError'));
      }
    },
  },
  mounted() {
    // Initialize car types from i18n
    const brands = this.$i18n.messages[this.$i18n.locale].cars.brands;
    this.carTypes = brands ? Object.keys(brands) : [];
    // Initialize category from localStorage if needed
    const storedCategory = localStorage.getItem('selectedCategory');
    if (storedCategory && this.carTypes.includes(storedCategory)) {
      this.data.metaCategory = storedCategory;
      this.updateCarModels();
    }
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
}

.shared-parent {
  border-radius: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
}

.main-title {
  color: #4CAF50;
  margin-bottom: 20px;
}

.form-input,
.form-select,
.form-textarea {
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
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  padding-right: 30px;
}

.form-textarea {
  height: 200px;
  resize: vertical;
}

.section-title,
.title,
label {
  color: #333;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
}

.feature-item input {
  margin-right: 8px;
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

.selected-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* Progress Bar Styles */
.progress-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: #e0e0e0;
  border-radius: 4px;
  outline: none;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.progress-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.finish-btn {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}

.finish-btn:hover {
  background-color: #45a049;
}

/* Dark mode styles */
.dark-mode .shared-parent {
  background-color: #2d2d2d !important;
}

.dark-mode .main-title {
  color: #66bb6a !important;
}

.dark-mode .section-title,
.dark-mode .title,
.dark-mode label,
.dark-mode .progress-info,
.dark-mode .selected-label {
  color: #e0e0e0 !important;
}

.dark-mode .form-input,
.dark-mode .form-select,
.dark-mode .form-textarea {
  background-color: #3a3a3a !important;
  border-color: #555 !important;
  color: #ffffff !important;
}

.dark-mode .form-select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e0e0e0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important;
}

.dark-mode .progress-slider {
  background: #555 !important;
}

.dark-mode .progress-slider::-webkit-slider-thumb {
  background: #66bb6a !important;
}

.dark-mode .progress-slider::-moz-range-thumb {
  background: #66bb6a !important;
}

.dark-mode .finish-btn {
  background-color: #66bb6a !important;
}

.dark-mode .finish-btn:hover {
  background-color: #558b2f !important;
}

/* RTL support for Arabic */
[dir="rtl"] .form-select {
  background-position: left 10px center;
  padding-right: 10px;
  padding-left: 30px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .spec-row {
    flex-direction: column;
    gap: 15px;
  }

  .spec-item {
    min-width: 100%;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    font-size: 13px;
    padding: 8px;
  }

  .finish-btn {
    width: 100%;
    padding: 10px;
  }
}
</style>