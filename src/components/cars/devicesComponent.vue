```vue
<template>
  <div class="parent2">
    <!-- Display error message if no brands are available -->
    <div v-if="!translatedBrands.length" class="error-message">
      {{ $t('devices.errors.noBrandsAvailable') || 'No device brands available. Please check translation data.' }}
    </div>

    <!-- Horizontal List of Device Types (Translated) -->
    <ul v-else class="horizontal-list">
      <li
          v-for="brand in translatedBrands"
          :key="brand.value"
          :class="['list-item', { 'selected': selectedDeviceType === brand.value }]"
          @click="handleDeviceTypeClick(brand)"
      >
        {{ brand.label }}
      </li>
    </ul>

    <!-- Horizontal List of Device Models (Translated) -->
    <ul v-if="selectedDeviceType && translatedModels.length" class="horizontal-list">
      <li
          v-for="model in translatedModels"
          :key="model.value"
          :class="['list-item', { 'selected': selectedDeviceModel === model.value }]"
          @click="handleDeviceModelClick(model)"
      >
        {{ model.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DevicesComponent",
  data() {
    return {
      selectedDeviceType: null, // Track the selected device type (lowercase English key)
      selectedDeviceModel: null, // Track the selected device model (lowercase English key)
      // Mapping of brand names (English or Arabic) to lowercase English keys and their index in devicesTypeList
      brandToKeyMap: {
        // English (en.json)
        'Apple': { key: 'apple', index: 0 },
        'Samsung': { key: 'samsung', index: 1 },
        'Sony': { key: 'sony', index: 2 },
        'Special Number': { key: 'specialnumber', index: 3 },
        'Home & Kitchen Appliances': { key: 'homekitchenappliances', index: 4 },
        'BlackBerry': { key: 'blackberry', index: 5 },
        'Canon': { key: 'canon', index: 6 },
        'LG': { key: 'lg', index: 7 },
        'Nokia': { key: 'nokia', index: 8 },
        'Microsoft': { key: 'microsoft', index: 9 },
        'Nikon': { key: 'nikon', index: 10 },
        'HTC': { key: 'htc', index: 11 },
        'Toshiba': { key: 'toshiba', index: 12 },
        'DELL': { key: 'dell', index: 13 },
        'Huawei': { key: 'huawei', index: 14 },
        'Asus': { key: 'asus', index: 15 },
        'Acer': { key: 'acer', index: 16 },
        'Panasonic': { key: 'panasonic', index: 17 },
        'Fujifilm': { key: 'fujifilm', index: 18 },
        'Hitachi': { key: 'hitachi', index: 19 },
        'Olympus': { key: 'olympus', index: 20 },
        'Computers': { key: 'computers', index: 21 },
        'Gaming': { key: 'gaming', index: 22 },
        'TV & Audio': { key: 'tvandaudio', index: 23 },
        'Generator': { key: 'generator', index: 24 },
        'Account and Subscription': { key: 'accountandsubscription', index: 25 },
        'Digital Camera': { key: 'digitalcamera', index: 26 },
        'Uncategorized Devices': { key: 'uncategorizeddevices', index: 27 },
        // Arabic (ar.json)
        'آبل': { key: 'apple', index: 0 },
        'سامسونج': { key: 'samsung', index: 1 },
        'سوني': { key: 'sony', index: 2 },
        'رقم مميز': { key: 'specialnumber', index: 3 },
        'أجهزة منزلية ومطبخ': { key: 'homekitchenappliances', index: 4 },
        'بلاك بيري': { key: 'blackberry', index: 5 },
        'كانون': { key: 'canon', index: 6 },
        'إل جي': { key: 'lg', index: 7 },
        'نوكيا': { key: 'nokia', index: 8 },
        'مايكروسوفت': { key: 'microsoft', index: 9 },
        'نيكون': { key: 'nikon', index: 10 },
        'إتش تي سي': { key: 'htc', index: 11 },
        'توشيبا': { key: 'toshiba', index: 12 },
        'ديل': { key: 'dell', index: 13 },
        'هواوي': { key: 'huawei', index: 14 },
        'أسوس': { key: 'asus', index: 15 },
        'آيسر': { key: 'acer', index: 16 },
        'باناسونيك': { key: 'panasonic', index: 17 },
        'فوجي فيلم': { key: 'fujifilm', index: 18 },
        'هيتاشي': { key: 'hitachi', index: 19 },
        'أوليمبوس': { key: 'olympus', index: 20 },
        'كمبيوترات': { key: 'computers', index: 21 },
        'ألعاب': { key: 'gaming', index: 22 },
        'تلفزيون وصوتيات': { key: 'tvandaudio', index: 23 },
        'مولد كهرباء': { key: 'generator', index: 24 },
        'حساب واشتراك': { key: 'accountandsubscription', index: 25 },
        'كاميرا رقمية': { key: 'digitalcamera', index: 26 },
        'أجهزة غير مصنفة': { key: 'uncategorizeddevices', index: 27 }
      },
      // Mapping of model names (English or Arabic) to lowercase English keys
      modelToKeyMap: {
        apple: {
          'Iphone': 'iphone',
          'Ipad': 'ipad',
          'MacBook': 'macbook',
          'Ipod': 'ipod',
          'Apple Watch': 'applewatch',
          'آيفون': 'iphone',
          'آيباد': 'ipad',
          'ماك بوك': 'macbook',
          'آيبود': 'ipod',
          'ساعة آبل': 'applewatch'
        },
        samsung: {
          'Galaxy S': 'galaxys',
          'Galaxy Note': 'galaxynote',
          'Galaxy Tab': 'galaxytab',
          'Samsung Camera': 'samsungcamera',
          'جالاكسي S': 'galaxys',
          'جالاكسي نوت': 'galaxynote',
          'جالاكسي تاب': 'galaxytab',
          'كاميرا سامسونج': 'samsungcamera'
        },
        sony: {
          'PlayStation': 'playstation',
          'PlayStation Games': 'playstationgames',
          'Xperia phones': 'xperia',
          'Laptop': 'laptop',
          'Screens': 'monitors',
          'بلايستيشن': 'playstation',
          'ألعاب بلايستيشن': 'playstationgames',
          'هواتف إكسبيريا': 'xperia',
          'لابتوب': 'laptop',
          'شاشات': 'monitors'
        },
        specialnumber: {
          'From STC': 'stc',
          'From Mobily': 'mobily',
          'From Zain': 'zain',
          'من STC': 'stc',
          'من موبايلي': 'mobily',
          'من زين': 'zain'
        },
        homekitchenappliances: {
          'Cooker and oven': 'ovenandstove',
          'Refrigerators': 'refrigerators',
          'Mixers': 'blenders',
          'Washing machine': 'washingmachine',
          'Boiler': 'heater',
          'Frying pan': 'fryer',
          'Coffee machine': 'coffeemaker',
          'Microwave and Toasters': 'microwaveandtoasters',
          'Vacuum Cleaner': 'vacuumcleaner',
          'Iron': 'iron',
          'Air Conditioner': 'airconditioner',
          'Other home appliances': 'otherappliances',
          'فرن وموقد': 'ovenandstove',
          'ثلاجات': 'refrigerators',
          'خلاطات': 'blenders',
          'غسالة': 'washingmachine',
          'سخان': 'heater',
          'مقلاة': 'fryer',
          'ماكينة قهوة': 'coffeemaker',
          'ميكروويف ومحامص': 'microwaveandtoasters',
          'مكنسة كهربائية': 'vacuumcleaner',
          'مكواة': 'iron',
          'مكيف هواء': 'airconditioner',
          'أجهزة منزلية أخرى': 'otherappliances'
        },
        blackberry: { 'BlackBerry': 'blackberry', 'بلاك بيري': 'blackberry' },
        canon: { 'Canon': 'canon', 'كانون': 'canon' },
        lg: { 'LG': 'lg', 'إل جي': 'lg' },
        nokia: { 'NOKIA': 'nokia', 'نوكيا': 'nokia' },
        nikon: { 'Nikon': 'nikon', 'نيكون': 'nikon' },
        htc: { 'HTC': 'htc', 'إتش تي سي': 'htc' },
        toshiba: { 'Toshiba': 'toshiba', 'توشيبا': 'toshiba' },
        dell: { 'DELL': 'dell', 'ديل': 'dell' },
        huawei: { 'Huawei': 'huawei', 'هواوي': 'huawei' },
        asus: { 'Asus': 'asus', 'أسوس': 'asus' },
        acer: { 'Acer': 'acer', 'آيسر': 'acer' },
        panasonic: { 'Panasonic': 'panasonic', 'باناسونيك': 'panasonic' },
        fujifilm: { 'Fujifilm': 'fujifilm', 'فوجي فيلم': 'fujifilm' },
        hitachi: { 'Hitachi': 'hitachi', 'هيتاشي': 'hitachi' },
        olympus: { 'Olympus': 'olympus', 'أوليمبوس': 'olympus' },
        computers: { 'Computers': 'computers', 'كمبيوترات': 'computers' },
        gaming: { 'Gaming': 'gaming', 'ألعاب': 'gaming' },
        tvandaudio: {
          'TV': 'television',
          'Receivers': 'receivers',
          'Audio': 'audio',
          'تلفزيون': 'television',
          'رسيفرات': 'receivers',
          'صوتيات': 'audio'
        },
        generator: { 'Generators': 'generators', 'مولدات': 'generators' },
        accountandsubscription: {
          'Pubg': 'pubg',
          'Fortnite': 'fortnite',
          'FIFA': 'fifa',
          'Clash of Clans': 'clashofclans',
          'Clash Royale': 'clashroyale',
          'Instagram accounts': 'instagramaccounts',
          'Twitter accounts': 'twitteraccounts',
          'TikTok accounts': 'tiktokaccounts',
          'Snapchat accounts': 'snapchataccounts',
          'Facebook accounts': 'facebookaccounts',
          'YouTube accounts': 'youtubeaccounts',
          'Other Accounts': 'otheraccounts',
          'ببجي': 'pubg',
          'فورتنايت': 'fortnite',
          'فيفا': 'fifa',
          'كلاش أوف كلانس': 'clashofclans',
          'كلاش رويال': 'clashroyale',
          'حسابات انستغرام': 'instagramaccounts',
          'حسابات تويتر': 'twitteraccounts',
          'حسابات تيك توك': 'tiktokaccounts',
          'حسابات سناب شات': 'snapchataccounts',
          'حسابات فيسبوك': 'facebookaccounts',
          'حسابات يوتيوب': 'youtubeaccounts',
          'حسابات أخرى': 'otheraccounts'
        },
        digitalcamera: {
          'Drones': 'drones',
          'Lenses': 'lenses',
          'Cameras': 'cameras',
          'Camera Accessories': 'cameraaccessories',
          'طائرات درون': 'drones',
          'عدسات': 'lenses',
          'كاميرات': 'cameras',
          'اكسسوارات كاميرا': 'cameraaccessories'
        },
        uncategorizeddevices: { 'Uncategorized': 'uncategorized', 'غير مصنف': 'uncategorized' },
        microsoft: {
          'Xbox Games': 'xboxgames',
          'Xbox': 'xbox',
          'Surface': 'surface',
          'ألعاب إكس بوكس': 'xboxgames',
          'إكس بوكس': 'xbox',
          'سيرفس': 'surface'
        }
      }
    };
  },
  computed: {
    // Get translated brands from devicesTypeList
    translatedBrands() {
      try {
        const currentDevicesList = this.$i18n.messages[this.$i18n.locale]?.devices?.devicesTypeList || [];
        const englishDevicesList = this.$i18n.messages['en']?.devices?.devicesTypeList || [];
        console.log('Current locale:', this.$i18n.locale); // Debug: Log current locale
        console.log('Current Devices Type List:', currentDevicesList); // Debug: Log current devicesTypeList
        console.log('English Devices Type List:', englishDevicesList); // Debug: Log English devicesTypeList
        const brands = currentDevicesList.map((label, idx) => {
          const englishLabel = englishDevicesList[idx] || label;
          const brandEntry = Object.entries(this.brandToKeyMap).find(
              ([translatedName]) => translatedName.toLowerCase() === englishLabel.toLowerCase()
          );
          const key = brandEntry ? brandEntry[1].key : `unknown${idx}`;
          return {
            value: key,
            label: this.$t(`devices.devicesTypeList.${idx}`) || label
          };
        });
        console.log('Mapped Brands:', brands); // Debug: Log mapped brands
        return brands;
      } catch (error) {
        console.error('Error accessing device types:', error);
        return [];
      }
    },
    // Get translated models for the selected device type
    translatedModels() {
      if (!this.selectedDeviceType) {
        console.log('No device type selected'); // Debug: Log when no device type is selected
        return [];
      }
      try {
        const modelKey = `${this.selectedDeviceType}ModelsList`;
        const devicesModels = this.$i18n.messages[this.$i18n.locale]?.devices?.devicesModels || {};
        console.log('Full devicesModels:', devicesModels); // Debug: Log full devicesModels object
        console.log(`Attempting to access models with key: ${modelKey}`); // Debug: Log the key being used
        const modelsList = devicesModels[modelKey] || [];
        console.log(`Models for ${this.selectedDeviceType} (${modelKey}):`, modelsList); // Debug: Log models
        if (!modelsList.length) {
          console.warn(`No models found for ${this.selectedDeviceType} with key ${modelKey}. Checking available keys:`, Object.keys(devicesModels));
        }
        const models = modelsList.map((label) => {
          const modelMap = this.modelToKeyMap[this.selectedDeviceType] || {};
          const modelValue = modelMap[label] || label.toLowerCase().replace(/\s+/g, '');
          return {
            value: modelValue,
            label: label // Use raw label since devicesModels contains translated names
          };
        });
        console.log(`Mapped Models for ${this.selectedDeviceType}:`, models); // Debug: Log mapped models
        return models;
      } catch (error) {
        console.error(`Error accessing models for ${this.selectedDeviceType} (${modelKey}):`, error);
        return [];
      }
    }
  },
  mounted() {
    // Log device types when the component is mounted
    console.log('Mounted - Available Device Types:', this.translatedBrands);
  },
  methods: {
    // Handle device type click
    handleDeviceTypeClick(brand) {
      this.selectedDeviceType = brand.value; // Set the selected device type (lowercase English key)
      this.selectedDeviceModel = null; // Reset selected device model
      console.log('User Selected Device Type:', {
        key: brand.value,
        display: brand.label
      }); // Debug: Log selected device type
      this.$emit('device-type-selected', brand.value); // Emit the lowercase English key
    },
    // Handle device model click
    handleDeviceModelClick(model) {
      this.selectedDeviceModel = model.value; // Set the selected device model (lowercase English key)
      console.log('User Selected Device Model:', {
        key: model.value,
        display: model.label
      }); // Debug: Log selected device model
      this.$emit('model-selected', model.value); // Emit the lowercase English key
    }
  }
};
</script>

<style scoped>
.parent2 {
  padding: 20px;
  overflow-x: auto;
  width: 100%;
  max-width: 2000px;
}

.horizontal-list {
  list-style-type: none;
  margin: 0;
  display: flex;
  gap: 10px;
}

.list-item {
  white-space: nowrap;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.list-item:hover {
  background-color: #f0f0f0;
}

.list-item.selected {
  background-color: green;
  color: white;
}

.error-message {
  color: red;
  text-align: center;
  padding: 10px;
  font-size: 14px;
}

.imported-component {
  width: 100%;
  max-width: 1400px;
  margin: 0 0 20px 0;
  text-align: left;
  overflow-x: auto;
}

.imported-component ul.horizontal-list {
  display: flex;
  gap: 10px;
  padding: 15px;
  margin: 0;
  list-style: none;
  justify-content: flex-start;
  overflow-x: auto;
  width: 100%;
}

.imported-component .list-item {
  white-space: nowrap;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.imported-component .list-item:hover {
  background-color: #f0f0f0;
}

.imported-component .list-item.selected {
  background-color: green;
  color: white;
}
</style>
```