<template>
  <div :class="[localIsDark ? 'full-height-container-dark' : 'full-height-container', { 'dark-mode': localIsDark }]">
    <div class="container shared-parent">
      <h2 class="main-title">{{ $t('devices.addDeviceOffer') }}</h2>
      <div class="form">
        <ImageUpload :isDark="localIsDark" v-model:images="data.images" />

        <div class="form-group">
          <label>{{ $t('devices.title') }}</label>
          <input type="text" v-model="data.title" class="form-input" :placeholder="$t('devices.enterDeviceTitle')" />
        </div>

        <div class="form-group">
          <label>{{ $t('devices.brand') }}</label>
          <select v-model="data.metaCategory" @change="updateModels" class="form-select">
            <option value="">{{ $t('devices.enterBrand') }}</option>
            <option v-for="brand in translatedBrands" :key="brand.value" :value="brand.value">
              {{ brand.label }}
            </option>
          </select>
        </div>

        <div class="form-group" v-if="filteredModels.length > 0">
          <label>{{ $t('devices.model') }}</label>
          <select v-model="data.model" class="form-select">
            <option value="">{{ $t('devices.model') }}</option>
            <option v-for="model in filteredModels" :key="model.value" :value="model.value">
              {{ model.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ $t('devices.price') }}</label>
          <input type="number" v-model="data.price" class="form-input" :placeholder="$t('devices.enterPrice')" />
        </div>

        <div class="form-group">
          <label>{{ $t('devices.description') }}</label>
          <textarea v-model="data.content" :placeholder="$t('devices.enterDeviceDescription')" class="form-textarea"></textarea>
        </div>

        <div class="button-container">
          <button class="finish-btn" @click="handleFinish">{{ $t('devices.submitOffer') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveProductForm } from '@/productFormStorage';
import { ConstVariables } from '../../../../const';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import ImageUpload from '@/components/addpost/ImageUpload.vue';
const brandToModelsKey = {
  Apple: "appleModelsList",
  Samsung: "samsungModelsList",
  Sony: "sonyModelsList",
  "Special Number": "specialNumbersList",
  "Home & Kitchen Appliances": "homeKitchenList",
  BlackBerry: "blackBerryModelsList",
  Canon: "canonModelsList",
  LG: "lgModelsList",
  Nokia: "nokiaModelsList",
  Microsoft: "microsoftModelsList",
  Nikon: "nikonModelsList",
  HTC: "htcModelsList",
  Toshiba: "toshibaModelsList",
  DELL: "dellModelsList",
  Huawei: "huaweiModelsList",
  Asus: "asusModelsList",
  Acer: "acerModelsList",
  Panasonic: "panasonicModelsList",
  Fujifilm: "fujifilmModelsList",
  Hitachi: "hitachiModelsList",
  Olympus: "olympusModelsList",
  Computers: "computersModelsList",
  Gaming: "gamingModelsList",
  "TV & Audio": "tvAndAudioModelsList",
  Generator: "generatorsModelsList",
  "Account and Subscription": "accountsAndSubscriptionsModelsList",
  "Digital Camera": "digitalCameraModelsList",
  "Uncategorized Devices": "unCategorizedModelsList"
};
export default {
  name: 'AddDeviceComponent',
  components: { ImageUpload },
  data() {
    return {
      localIsDark: false,
      data: {
        baseUrl: 'https://backend.jordan-souq.com',
        title: '',
        price: '',
        metaCategory: '',
        model: '',
        content: '',
        userId: '',
        images: [],
      },
      categoryList: ConstVariables.devicesTypeList || [],
      filteredModels: [],
    };
  },
  computed: {
    // Brands with translation
    translatedBrands() {
      return this.categoryList.map(brandEn => ({
        value: brandEn,
        label: this.$t(`devices.devicesTypeList.${this.categoryList.indexOf(brandEn)}`) || brandEn
      }));
    }
  },
  methods: {
    updateModels() {
      this.data.model = '';
      const devicesModels = this.$i18n.messages[this.$i18n.locale].devices.devicesModels;
      const modelKey = brandToModelsKey[this.data.metaCategory];
      const models = devicesModels ? devicesModels[modelKey] : [];
      this.filteredModels = Array.isArray(models)
          ? models.map(modelEn => ({
            value: modelEn,
            label: modelEn
          }))
          : [];
    },
    toastError() {
      toast.error('Please login to access this feature', {
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
      toast.success('Your Offer Created Successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: this.localIsDark ? 'dark' : 'light',
      });
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
        const rawData = localStorage.getItem('productForm');
        const dataForm = rawData ? JSON.parse(rawData) : {};
        // Append other data fields (English values)
        formData.append('title', this.data.title);
        formData.append('price', this.data.price);
        formData.append('metaCategory', this.data.metaCategory); // English value
        formData.append('carType', this.data.model); // English value
        formData.append('content', description);
        formData.append('description', description);
        formData.append('category', 'devices');
        formData.set('Arlocation', dataForm.data?.Arlocation || '');
        formData.set('location', dataForm.data?.location || '');
        formData.set('metaLocation', dataForm.data?.metaLocation || '');
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (userId) {
          formData.append('userId', userId);
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
            images: [],
          });
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        console.error('Submission failed:', error);
        toast.error('Failed to submit offer', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: this.localIsDark ? 'dark' : 'light',
        });
      }
    },
  },
  mounted() {
    const storedCategory = localStorage.getItem('selectedCategory');
    if (storedCategory) {
      this.categoryList = ConstVariables.devicesTypeList;
      // Use a more descriptive log or remove it
      console.log("selectedCategory found in localStorage:", storedCategory);
    }
  }
};
</script>

<style scoped>
.full-height-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
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
  max-width: 800px;
  margin: 0 auto;
}

.shared-parent {
  border-radius: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  transition: background-color 0.3s ease;
  padding: 20px;
}

.main-title {
  color: #4CAF50;
  margin-bottom: 20px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #333;
  transition: all 0.3s ease;
  font-size: 16px;
  box-sizing: border-box;
}

.form-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

.form-textarea {
  height: 150px;
  resize: vertical;
}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.finish-btn {
  padding: 14px 28px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
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

.dark-mode .form-group label {
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

.dark-mode .finish-btn {
  background-color: #66bb6a !important;
}

.dark-mode .finish-btn:hover {
  background-color: #558b2f !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .shared-parent {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    font-size: 14px;
    padding: 10px;
  }

  .finish-btn {
    padding: 12px 24px;
  }
}
</style>