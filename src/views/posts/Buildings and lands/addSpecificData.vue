<template>
  <div :class="[localIsDark ? 'full-height-container-dark' : 'full-height-container', { 'dark-mode': localIsDark, 'rtl-direction': isRTL }]">
    <div class="container shared-parent">
      <h2 class="main-title">{{ $t('propertyDetails.title') }}</h2>
      <div class="form">
        <!-- Image Upload Component -->
        <ImageUpload :isDark="localIsDark" v-model:images="images" />

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
              >
                {{ $t(`propertyDetails.condition.options.${index}`) }}
              </div>
            </div>
          </div>
        </div>
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.buildingMeters') }}</label>
            <input type="number" v-model="buildingMeters" class="form-input" :placeholder="$t('propertyDetails.enterBuildingMeters')" />
          </div>
        </div>
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.landMeters') }}</label>
            <input type="number" v-model="landMeters" class="form-input" :placeholder="$t('propertyDetails.enterLandMeters')" />
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
              >
                {{ $t(`propertyDetails.ageOptions.${age}`) }}
              </div>
            </div>
          </div>
        </div>
        <div class="spec-row">
          <div class="spec-item">
            <label>{{ $t('propertyDetails.description') }}</label>
            <textarea v-model="description" class="form-input" :placeholder="$t('propertyDetails.enterDescription')" rows="4"></textarea>
          </div>
        </div>
        <div class="spec-row">
          <div class="spec-item">
            <button class="submit-btn" @click="handleSubmit">{{ $t('propertyDetails.submit') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageUpload from '@/components/addpost/ImageUpload.vue';

export default {
  name: 'AddSpecificData',
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
      rooms: {
        title: 'Number Of Rooms', // Default value, will be overridden in created
        numberOfRooms: [1, 2, 3, 4, 5, 6, 7, 8, 'More'],
      },
      bathrooms: {
        title: 'Number Of Bathrooms', // Default value, will be overridden in created
        numberOfBathrooms: [1, 2, 3, 4, 5, 6, 7, 8, 'More'],
      },
      Conditionofbrushes: {
        title: 'Condition of brushes', // Default value, will be overridden in created
        state: ['Fully furnished', 'Partially furnished', 'Unfurnished'],
      },
      numberOffloors: {
        title: 'Number Of Floors', // Default value, will be overridden in created
        state: ['Initial settlement', 'Second settlement', 'Third settlement', 'Ground floor', 1, 2, 3, 4, 5, 6, 7, 8, 9, '+10', 'Top floor with roof'],
      },
      buildingAgeOptions: ['under building', '0-1 year', '1-5 year'], // Options for building age
      selectedRooms: null, // Track selected room
      selectedBathrooms: null, // Track selected bathroom
      selectedCondition: null, // Track selected condition
      buildingMeters: '', // Track building meters
      landMeters: '', // Track land meters
      selectedNumberOfFloor: null, // Track selected floor
      selectedBuildingAge: null, // Track selected building age
      description: '', // Track description
      images: [], // Track uploaded images
    };
  },
  created() {
    // Set translated titles when the component is created
    this.rooms.title = this.$t('propertyDetails.rooms.title');
    this.bathrooms.title = this.$t('propertyDetails.bathrooms.title');
    this.Conditionofbrushes.title = this.$t('propertyDetails.condition.title');
    this.numberOffloors.title = this.$t('propertyDetails.floors.title');
  },
  methods: {
    toggleDarkMode() {
      this.localIsDark = !this.localIsDark;
    },
    selectRoom(index) {
      this.selectedRooms = this.selectedRooms === index ? null : index; // Toggle selection
    },
    selectBathroom(index) {
      this.selectedBathrooms = this.selectedBathrooms === index ? null : index; // Toggle selection
    },
    selectCondition(index) {
      this.selectedCondition = this.selectedCondition === index ? null : index; // Toggle selection
    },
    selectNumberOfFloor(index) {
      this.selectedNumberOfFloor = this.selectedNumberOfFloor === index ? null : index; // Toggle selection
    },
    selectBuildingAge(age) {
      this.selectedBuildingAge = this.selectedBuildingAge === age ? null : age; // Toggle selection
    },
    handleSubmit() {
      // Basic validation
      if (!this.description.trim()) {
        alert(this.$t('propertyDetails.validation.description'));
        return;
      }
      if (this.images.length === 0) {
        alert(this.$t('propertyDetails.validation.images'));
        return;
      }
      if (!this.buildingMeters && !this.landMeters) {
        alert(this.$t('propertyDetails.validation.meters'));
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('description', this.description);
      this.images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });
      formData.append('buildingMeters', this.buildingMeters || 0);
      formData.append('landMeters', this.landMeters || 0);
      formData.append('rooms', this.selectedRooms || '');
      formData.append('bathrooms', this.selectedBathrooms || '');
      formData.append('condition', this.selectedCondition || '');
      formData.append('floors', this.selectedNumberOfFloor || '');
      formData.append('age', this.selectedBuildingAge || '');

      // Placeholder for API call (replace with actual endpoint)
      console.log('Form Data:', Object.fromEntries(formData));
      // Example API call (uncomment and adjust as needed)
      // axios.post('https://your-api-endpoint.com/property', formData)
      //   .then(response => {
      //     console.log('Success:', response.data);
      //     alert(this.$t('propertyDetails.success'));
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //     alert(this.$t('propertyDetails.error'));
      //   });

      // Reset form after submission (optional)
      this.resetForm();
    },
    resetForm() {
      this.selectedRooms = null;
      this.selectedBathrooms = null;
      this.selectedCondition = null;
      this.buildingMeters = '';
      this.landMeters = '';
      this.selectedNumberOfFloor = null;
      this.selectedBuildingAge = null;
      this.description = '';
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
  width: 80vw; /* Adjusted to match parent's width */
  margin: 0 auto; /* Center the container horizontally */
}

.shared-parent {
  border-radius: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  width: 80vw; /* Set parent width to 80vw */
  transition: background-color 0.3s ease;
}

.dark-mode .shared-parent {
  background-color: #2d2d2d !important;
}

.main-title {
  color: #4CAF50;
  margin-bottom: 20px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}

button:hover {
  background-color: #45a049;
}

.dark-mode button {
  background-color: #66bb6a !important;
}

.dark-mode button:hover {
  background-color: #558b2f !important;
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

.dark-mode .form-input {
  background-color: #3a3a3a !important;
  border-color: #555 !important;
  color: #ffffff !important;
}

.rtl-direction .spec-row {
  flex-direction: row-reverse;
}

[dir="rtl"] .btns-container {
  flex-direction: row-reverse;
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
    width: 90vw;
  }

  .shared-parent {
    width: 90vw; /* Adjust parent width on smaller screens */
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

  .form-input {
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

  .form-input {
    padding: 6px;
    font-size: 13px;
  }

  .submit-btn {
    padding: 8px;
  }
}
</style>