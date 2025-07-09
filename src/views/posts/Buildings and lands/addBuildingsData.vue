<template>
  <div :class="[localIsDark ? 'full-height-container-dark' : 'full-height-container', { 'dark-mode': localIsDark, 'rtl-direction': isRTL }]">
    <div class="container shared-parent">
      <h2 class="main-title">{{ $t('propertyDetails.title') }}</h2>
      <div class="form">
        <!-- Image Upload Component -->
        <ImageUpload :isDark="localIsDark" v-model:images="images" />

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.titleLabel') }}</label>
            <input
                type="text"
                v-model="title"
                class="form-input"
                :placeholder="$t('propertyDetails.enterTitle')"
                :aria-label="$t('propertyDetails.titleLabel')"
            />
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('building.type') }}</label>
            <select v-model="saleState" class="form-select" :aria-label="$t('building.type')">
              <option value="">{{ $t('propertyDetails.selectSaleState') }}</option>
              <option v-for="option in buildingOptions" :value="option.value" :key="option.value">
                {{ $t(`building.options.${option.name}`) }}
              </option>
            </select>
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.rooms.title') }}</label>
            <div class="btns-container">
              <div
                  v-for="index in rooms.numberOfRooms"
                  :key="index"
                  class="btns"
                  :tabindex="0"
                  :class="{ selected: selectedRooms === index }"
                  @click="selectRoom(index)"
                  @keydown.enter="selectRoom(index)"
                  role="button"
                  :aria-label="$t('propertyDetails.rooms.title') + ': ' + index"
              >
                {{ index }}
              </div>
            </div>
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.bathrooms.title') }}</label>
            <div class="btns-container">
              <div
                  v-for="index in bathrooms.numberOfBathrooms"
                  :key="index"
                  class="btns"
                  :tabindex="0"
                  :class="{ selected: selectedBathrooms === index }"
                  @click="selectBathroom(index)"
                  @keydown.enter="selectBathroom(index)"
                  role="button"
                  :aria-label="$t('propertyDetails.bathrooms.title') + ': ' + index"
              >
                {{ index }}
              </div>
            </div>
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.condition.title') }}</label>
            <div class="btns-container">
              <div
                  v-for="index in Conditionofbrushes.state"
                  :key="index"
                  class="btns"
                  :tabindex="0"
                  :class="{ selected: selectedCondition === index }"
                  @click="selectCondition(index)"
                  @keydown.enter="selectCondition(index)"
                  role="button"
                  :aria-label="$t('propertyDetails.condition.title') + ': ' + $t(`propertyDetails.condition.options.${index}`)"
              >
                {{ $t(`propertyDetails.condition.options.${index}`) }}
              </div>
            </div>
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.buildingMeters') }}</label>
            <input
                type="number"
                v-model="buildingMeters"
                class="form-input"
                :placeholder="$t('propertyDetails.enterBuildingMeters')"
                min="0"
                :aria-label="$t('propertyDetails.buildingMeters')"
            />
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.landMeters') }}</label>
            <input
                type="number"
                v-model="landMeters"
                class="form-input"
                :placeholder="$t('propertyDetails.enterLandMeters')"
                min="0"
                :aria-label="$t('propertyDetails.landMeters')"
            />
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.price') }}</label>
            <input
                type="number"
                v-model="price"
                class="form-input"
                :placeholder="$t('propertyDetails.enterPrice')"
                min="0"
                :aria-label="$t('propertyDetails.price')"
            />
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.floors.title') }}</label>
            <div class="btns-container">
              <div
                  v-for="index in numberOffloors.state"
                  :key="index"
                  class="btns"
                  :tabindex="0"
                  :class="{ selected: selectedNumberOfFloor === index }"
                  @click="selectNumberOfFloor(index)"
                  @keydown.enter="selectNumberOfFloor(index)"
                  role="button"
                  :aria-label="$t('propertyDetails.floors.title') + ': ' + $t(`propertyDetails.floors.options.${index}`)"
              >
                {{ $t(`propertyDetails.floors.options.${index}`) }}
              </div>
            </div>
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.buildingAge') }}</label>
            <div class="btns-container">
              <div
                  v-for="age in buildingAgeOptions"
                  :key="age"
                  class="btns"
                  :tabindex="0"
                  :class="{ selected: selectedBuildingAge === age }"
                  @click="selectBuildingAge(age)"
                  @keydown.enter="selectBuildingAge(age)"
                  role="button"
                  :aria-label="$t('propertyDetails.buildingAge') + ': ' + $t(`propertyDetails.ageOptions.${age}`)"
              >
                {{ $t(`propertyDetails.ageOptions.${age}`) }}
              </div>
            </div>
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.description') }}</label>
            <textarea
                v-model="description"
                class="form-input"
                :placeholder="$t('propertyDetails.enterDescription')"
                rows="4"
                :aria-label="$t('propertyDetails.description')"
            ></textarea>
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-item">
            <button class="submit-btn" @click="handleSubmit" :disabled="isSubmitting">
              {{ isSubmitting ? $t('propertyDetails.loading') : $t('propertyDetails.submit') }}
            </button>
          </div>
        </div>
      </div>
    </div>
<!--    <fixed-bottom :isDark="localIsDark" />-->
  </div>
</template>

<script>
import { saveProductForm, getProductForm } from '@/productFormStorage';
import ImageUpload from '@/components/addpost/ImageUpload.vue';
// import FixedBottom from '@/components/FixedBottom.vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export default {
  name: 'AddSpecificData',
  components: {
    ImageUpload,
    // FixedBottom,
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
      localIsDark: this.isDark,
      isSubmitting: false,
      title: '',
      saleState: '',
      rooms: {
        numberOfRooms: [1, 2, 3, 4, 5, 6, 7, 8, 'More'],
      },
      bathrooms: {
        numberOfBathrooms: [1, 2, 3, 4, 5, 6, 7, 8, 'More'],
      },
      Conditionofbrushes: {
        state: ['Fully furnished', 'Partially furnished', 'Unfurnished'],
      },
      numberOffloors: {
        state: [
          'Initial settlement',
          'Second settlement',
          'Third settlement',
          'Ground floor',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '+10',
          'Top floor with roof',
          'third-basement',
        ],
      },
      buildingAgeOptions: ['under building', '0-1 year', '1-5 year'],
      buildingOptions: [
        { name: 'عقار للبيع', value: 'sale' },
        { name: 'عقار للإيجار', value: 'rent' },
      ],
      selectedRooms: null,
      selectedBathrooms: null,
      selectedCondition: null,
      buildingMeters: '',
      landMeters: '',
      price: '',
      selectedNumberOfFloor: null,
      selectedBuildingAge: null,
      description: '',
      images: [],
      baseUrl: 'https://backend.jordan-souq.com',
    };
  },
  watch: {
    isDark(newVal) {
      this.localIsDark = newVal;
    },
  },
  created() {
    this.rooms.title = this.$t('propertyDetails.rooms.title');
    this.bathrooms.title = this.$t('propertyDetails.bathrooms.title');
    this.Conditionofbrushes.title = this.$t('propertyDetails.condition.title');
    this.numberOffloors.title = this.$t('propertyDetails.floors.title');
  },
  methods: {
    selectRoom(index) {
      this.selectedRooms = this.selectedRooms === index ? null : index;
    },
    selectBathroom(index) {
      this.selectedBathrooms = this.selectedBathrooms === index ? null : index;
    },
    selectCondition(index) {
      this.selectedCondition = this.selectedCondition === index ? null : index;
    },
    selectNumberOfFloor(index) {
      this.selectedNumberOfFloor = this.selectedNumberOfFloor === index ? null : index;
    },
    selectBuildingAge(age) {
      this.selectedBuildingAge = this.selectedBuildingAge === age ? null : age;
    },
    toastSuccess() {
      toast.success(this.$t('propertyDetails.success'), {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: this.localIsDark ? 'dark' : 'light',
      });
    },
    async handleSubmit() {
      // Validation
      if (!this.title.trim()) {
        toast.error(this.$t('propertyDetails.validation.title'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }
      if (!this.saleState) {
        toast.error(this.$t('propertyDetails.validation.saleState'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }
      if (!this.selectedRooms) {
        toast.error(this.$t('propertyDetails.validation.rooms'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }
      if (!this.selectedBathrooms) {
        toast.error(this.$t('propertyDetails.validation.bathrooms'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }
      if (!this.selectedCondition) {
        toast.error(this.$t('propertyDetails.validation.condition'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }
      if (!this.buildingMeters && !this.landMeters) {
        toast.error(this.$t('propertyDetails.validation.meters'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }
      if (!this.price) {
        toast.error(this.$t('propertyDetails.validation.price'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }
      if (!this.selectedNumberOfFloor) {
        toast.error(this.$t('propertyDetails.validation.floors'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }
      // if (!this.selectedBuildingAge) {
      //   toast.error(this.$t('propertyDetails.validation.buildingAge'), { theme: this.localIsDark ? 'dark' : 'light' });
      //   return;
      // }
      if (!this.description.trim()) {
        toast.error(this.$t('propertyDetails.validation.description'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }
      if (this.images.length === 0) {
        toast.error(this.$t('propertyDetails.validation.images'), { theme: this.localIsDark ? 'dark' : 'light' });
        return;
      }

      this.isSubmitting = true;
      try {
        // Prepare form data
        const formData = new FormData();

        // Use description directly
        const description = this.description || '';

        // Append images as image1, image2, etc.
        if (this.images.length > 0) {
          for (let i = 0; i < this.images.length; i++) {
            formData.append(`image${i + 1}`, this.images[i]);
          }
        }

        // Append other data fields
        const fieldsToExclude = ['images', 'description', 'content'];
        const formFields = {
          title: this.title,
          saleState: this.saleState,
          numberOfrooms: this.selectedRooms,
          numberOfbathrooms: this.selectedBathrooms,
          mafrosha: this.selectedCondition.toLowerCase().includes('furnished') ? 'furnished' : 'unfurnished',
          buildingSpace: parseInt(this.buildingMeters) || 0,
          buildingArea: parseInt(this.buildingMeters) || 0,
          landArea: parseInt(this.landMeters) || 0,
          price: parseInt(this.price) || 0,
          floorOption: this.selectedNumberOfFloor,
          buildingAge: this.selectedBuildingAge,
          description: description,
          content: description,
          category: 'عقار',
          metaCategory: `apartment for ${this.saleState}`,
        };

        Object.entries(formFields).forEach(([key, value]) => {
          if (!fieldsToExclude.includes(key)) {
            formData.append(key, value ?? '');
          }
        });

        // Get saved form values from localStorage
        const rawData = localStorage.getItem('productForm');
        const dataForm = rawData ? JSON.parse(rawData) : {};
        const userId = localStorage.getItem('userId');

        // Append additional fields
        formData.set('userId', userId || '');
        formData.set('Arlocation', dataForm.data?.Arlocation || '');
        formData.set('location', dataForm.data?.location || '');
        formData.set('metaLocation', dataForm.data?.metaLocation || '');

        // Debugging logs
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }

        // API call
        const response = await axios.post(`${this.baseUrl}/product/create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200 || response.status === 201) {
          this.toastSuccess();

          // Save back to localStorage
          const currentForm = getProductForm() || {};
          saveProductForm({
            ...currentForm,
            data: {
              ...formFields,
              images: [], // Clear images in localStorage
            },
          });

          console.log('Offer submitted:', formFields);
          this.resetForm();
          this.$router.push('/');
        } else if (response.status === 400) {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: this.localIsDark ? 'dark' : 'light',
          });
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        console.error('Submission failed:', error);
        toast.error(this.$t('propertyDetails.error'), {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: this.localIsDark ? 'dark' : 'light',
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.title = '';
      this.saleState = '';
      this.selectedRooms = null;
      this.selectedBathrooms = null;
      this.selectedCondition = null;
      this.buildingMeters = '';
      this.landMeters = '';
      this.price = '';
      this.selectedNumberOfFloor = null;
      this.selectedBuildingAge = null;
      this.description = '';
      this.images = [];
    },
  },
};
</script>

<style scoped>
.full-height-container {
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  transition: all 0.3s ease;
  margin-top: 60px;
}

.full-height-container-dark {
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  background-color: #0b141a !important;
  font-family: Arial, sans-serif;
  transition: all 0.3s ease;
  margin-top: 60px;
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
  padding: 20px;
  transition: background-color 0.3s ease;
}

.dark-mode .shared-parent {
  background-color: #111b21 !important;
}

.main-title {
  color: #25d366;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
}

.dark-mode .main-title {
  color: #00a884 !important;
}

.submit-btn {
  padding: 12px 24px;
  background-color: #25d366;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  width: 100%;
}

.submit-btn:hover {
  background-color: #1eb058;
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.dark-mode .submit-btn {
  background-color: #00a884 !important;
}

.dark-mode .submit-btn:hover {
  background-color: #008c6e !important;
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
  color: #111827;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

.dark-mode .spec-item label {
  color: #e0e0e0 !important;
}

.btns-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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
}

.dark-mode .btns {
  background-color: #2a3942 !important;
  color: #e0e0e0 !important;
}

.btns:hover {
  background-color: #d0d0d0;
}

.dark-mode .btns:hover {
  background-color: #3a4a56 !important;
}

.btns.selected {
  background-color: #25d366 !important;
  color: white !important;
}

.dark-mode .btns.selected {
  background-color: #00a884 !important;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  color: #111827;
  transition: all 0.3s ease;
  font-size: 14px;
}

.dark-mode .form-input,
.dark-mode .form-select {
  background-color: #1f2a44 !important;
  border-color: #2a3942 !important;
  color: #e0e0e0 !important;
}

.form-select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111827' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  padding-right: 30px;
  appearance: none;
}

.dark-mode .form-select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e0e0e0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
}

.rtl-direction .spec-row {
  flex-direction: row-reverse;
}

[dir="rtl"] .btns-container {
  flex-direction: row-reverse;
}

[dir="rtl"] .form-select {
  background-position: left 10px center;
  padding-right: 10px;
  padding-left: 30px;
}

@media (max-width: 768px) {
  .container,
  .shared-parent {
    width: 90vw;
    padding: 15px;
  }

  .spec-row {
    flex-direction: column;
    gap: 15px;
  }

  .spec-item {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .container,
  .shared-parent {
    width: 95vw;
    padding: 10px;
  }

  .btns {
    padding: 8px 15px;
    font-size: 13px;
  }

  .form-input,
  .form-select {
    padding: 8px;
    font-size: 13px;
  }

  .submit-btn {
    padding: 10px;
  }
}
</style>