<template>
  <div :class="[localIsDark ? 'full-height-container-dark' : 'full-height-container', { 'dark-mode': localIsDark, 'rtl-direction': isRTL }]">
    <div class="container shared-parent">
      <h2 class="main-title">{{ $t('propertyDetails.title') }}</h2>
      <div class="form">
        <!-- Image Upload Component -->
        <ImageUpload :isDark="localIsDark" v-model:images="images" />
        <!-- Title Input -->
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
  </div>
</template>

<script>
import ImageUpload from '@/components/addpost/ImageUpload.vue';
import axios from 'axios';

export default {
  name: 'AddBuildingsSpecificData',
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
      title: '',
      price: 0,
      metaCategoryType: 'building', // Default metaCategory, overridden by type prop
      localIsDark: this.isDark,
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
        ],
      },
      buildingAgeOptions: ['under building', '0-1 year', '1-5 year'],
      selectedRooms: null,
      selectedBathrooms: null,
      selectedCondition: null,
      buildingMeters: '',
      landMeters: '',
      selectedNumberOfFloor: null,
      selectedBuildingAge: null,
      description: '',
      images: [],
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
    // Set metaCategoryType from type prop
    if (this.type) {
      this.metaCategoryType = this.type.toLowerCase();
    } else {
      console.warn('Missing type prop, defaulting to "building"');
    }
    console.log('metaCategoryType:', this.metaCategoryType);
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
    async handleSubmit() {
      // Comprehensive validation
      if (!this.title.trim()) {
        alert(this.$t('propertyDetails.validation.title'));
        return;
      }
      if (!this.metaCategoryType) {
        alert(this.$t('propertyDetails.validation.metaCategory'));
        return;
      }
      if (!this.selectedRooms) {
        alert(this.$t('propertyDetails.validation.rooms'));
        return;
      }
      if (!this.selectedBathrooms) {
        alert(this.$t('propertyDetails.validation.bathrooms'));
        return;
      }
      if (!this.selectedCondition) {
        alert(this.$t('propertyDetails.validation.condition'));
        return;
      }
      if (!this.buildingMeters && !this.landMeters) {
        alert(this.$t('propertyDetails.validation.meters'));
        return;
      }
      if (!this.selectedNumberOfFloor) {
        alert(this.$t('propertyDetails.validation.floors'));
        return;
      }
      if (!this.selectedBuildingAge) {
        alert(this.$t('propertyDetails.validation.buildingAge'));
        return;
      }
      if (!this.description.trim()) {
        alert(this.$t('propertyDetails.validation.description'));
        return;
      }
      if (this.images.length === 0) {
        alert(this.$t('propertyDetails.validation.images'));
        return;
      }

      this.isSubmitting = true;
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('content', this.description);
      formData.append('description', this.description);
      this.images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });
      console.log('metaCategory:', this.metaCategoryType.toLowerCase());
      formData.append('metaCategory', localStorage.getItem('selectedBuildingType').toLowerCase());
      formData.append('category', 'عقار');
      formData.append('buildingSpace', this.buildingMeters || 0);
      formData.append('landArea', this.landMeters || 0);
      formData.append('numberOfrooms', this.selectedRooms || '');
      formData.append('numberOfbathrooms', this.selectedBathrooms || '');
      formData.append('mafrosha', this.selectedCondition || '');
      formData.append('floors', this.selectedNumberOfFloor || '');
      formData.append('buildingAge', this.selectedBuildingAge || '');
      formData.append('userId', localStorage.getItem('userId') || '');
      formData.append('price', this.price || 0);

      try {
        const response = await axios.post(`${this.baseUrl}/product/create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert(this.$t('propertyDetails.success'));
        this.resetForm();
        this.$router.push('/');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert(this.$t('propertyDetails.error'));
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.title = '';
      this.selectedRooms = null;
      this.selectedBathrooms = null;
      this.selectedCondition = null;
      this.buildingMeters = '';
      this.landMeters = '';
      this.price = 0;
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

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  color: #111827;
  transition: all 0.3s ease;
  font-size: 14px;
}

.dark-mode .form-input {
  background-color: #1f2a44 !important;
  border-color: #2a3942 !important;
  color: #e0e0e0 !important;
}

.rtl-direction .spec-row {
  flex-direction: row-reverse;
}

[dir="rtl"] .btns-container {
  flex-direction: row-reverse;
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

  .form-input {
    padding: 8px;
    font-size: 13px;
  }

  .submit-btn {
    padding: 10px;
  }
}

.btns-container {
  justify-content: center;
}
</style>