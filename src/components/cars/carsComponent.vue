<template>
  <div class="parent2">
    <!-- Horizontal List of Car Types -->
    <ul class="horizontal-list">
      <li
          v-for="car in cars"
          :key="car"
          :class="['list-item', { 'selected': selectedCarType === car }]"
          @click="handleCarTypeClick(car)"
      >
        {{ car }}
      </li>
    </ul>

    <!-- Horizontal List of Car Models -->
    <ul v-if="selectedCarType" class="horizontal-list">
      <li
          v-for="model in getCarModels(selectedCarType)"
          :key="model"
          :class="['list-item', { 'selected': selectedCarModel === model }]"
          @click="handleCarModelClick(model)"
      >
        {{ model }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ConstVariables } from "../../../const.js";

export default {
  name: "CarsComponent",
  data() {
    return {
      cars: ConstVariables.carsTypeList, // List of car types
      selectedCarType: null, // Track the selected car type
      selectedCarModel: null, // Track the selected car model
    };
  },
  methods: {
    // Handle car type click
    handleCarTypeClick(car) {
      this.selectedCarType = car; // Set the selected car type
      this.selectedCarModel = null; // Reset selected car model when a new car type is selected
      const lowercaseCarType = car.toLowerCase(); // Convert car type to lowercase
      this.$emit("car-type-selected", lowercaseCarType); // Emit the lowercase car type
    },
    // Handle car model click
    handleCarModelClick(model) {
      this.selectedCarModel = model; // Set the selected car model
      const lowercaseModel = model.toLowerCase(); // Convert car model to lowercase
      this.$emit("model-selected", lowercaseModel); // Emit the lowercase car model
    },
    // Get car models dynamically based on the selected car type
    getCarModels(carType) {
      // Map car types to their corresponding model lists in ConstVariables
      const carModelsMap = {
        Toyota: ConstVariables.toyotaCarModels,
        Honda: ConstVariables.hondaCarModels,
        Ford: ConstVariables.fordModels,
        Chevrolet: ConstVariables.chevroletCarModels,
        Nissan: ConstVariables.nissanCarModels,
        Hyundai: ConstVariables.hyundaiModels,
        Kia: ConstVariables.kiaModels,
        Lexus: ConstVariables.lexusCarModels,
        Mazda: ConstVariables.mazdaCarModels,
        Mercedes: ConstVariables.mercedesCarModels,
        BMW: ConstVariables.bmwCarModels,
        Geely: ConstVariables.geelyCarModels,
        Dodge: ConstVariables.dodgeCarModels,
        Chrysler: ConstVariables.chryslerCarModels,
        Jeep: ConstVariables.jeepModels,
        Mitsubishi: ConstVariables.mitsubishiModels,
        Isuzu: ConstVariables.isuzuModels,
        LandRover: ConstVariables.landRoverModels,
        Cadillac: ConstVariables.cadillacModels,
        Porsche: ConstVariables.porscheModels,
        Audi: ConstVariables.audiModels,
        Suzuki: ConstVariables.suzukiModels,
        Infinity: ConstVariables.infinitiModels,
        Hummer: ConstVariables.hummerModels,
        Lincoln: ConstVariables.lincolnModels,
        Volkswagen: ConstVariables.volkswagenModels,
        Daihatsu: ConstVariables.daihatsuModels,
        Mercury: ConstVariables.mercuryModels,
        Volvo: ConstVariables.volvoModels,
        Peugeot: ConstVariables.peugeotModels,
        Bentley: ConstVariables.bentleyModels,
        Jaguar: ConstVariables.jaguarModels,
        Subaru: ConstVariables.subaruModels,
        ZXAUTO: ConstVariables.zxautoModels,
        Changan: ConstVariables.changanModels,
        Renault: ConstVariables.renaultModels,
        Buick: ConstVariables.buickModels,
        Maserati: ConstVariables.maseratiModels,
        RollsRoyce: ConstVariables.rollsRoyceModels,
        Lamborghini: ConstVariables.lamborghiniModels,
        Ferrari: ConstVariables.ferrariModels,
        Citroen: ConstVariables.citroenModels,
        Seat: ConstVariables.seatModels,
        Saab: ConstVariables.saabModels,
        Fiat: ConstVariables.fiatCarNames,
        SsangYong: ConstVariables.ssangYongCarNames,
        AstonMartin: ConstVariables.astonMartinCarNames,
        Proton: ConstVariables.protonCarNames,
        Haval: ConstVariables.havalCarNames,
        GAC: ConstVariables.gacCarNames,
        GreatWall: ConstVariables.greatWallCarNames,
        FAW: ConstVariables.fawCarNames,
        BYD: ConstVariables.bydCarNames,
        AlfaRomeo: ConstVariables.alfaRomeoModels,
        TATA: ConstVariables.tataModels,
        JMC: ConstVariables.jmcModels,
        JETOUR: ConstVariables.jetourModels,
        CMC: ConstVariables.cmcModels,
        Foton: ConstVariables.fotonModels,
        VictoryAuto: ConstVariables.victoryAutoModels,
        Lifan: ConstVariables.lifanModels,
        Maxus: ConstVariables.maxusModels,
        McLaren: ConstVariables.mclarenModels,
        JAC: ConstVariables.jacModels,
        Baic: ConstVariables.baicModels,
        Dongfeng: ConstVariables.dongfengModels,
        EXEED: ConstVariables.exeedModels,
        Tesla: ConstVariables.teslaModels,
        Lucid: ConstVariables.lucidModels,
        INEOS: ConstVariables.ineosModels,
        Soueast: ConstVariables.soueastModels,
        Mahindra: ConstVariables.mahindraModels,
        Zotye: ConstVariables.zotyeModels,
        Hongqi: ConstVariables.hongqiModels,
        SMART: ConstVariables.smartModels,
        Tank: ConstVariables.tankModels,
        LynkCo: ConstVariables.lynkCoModels,
        Opel: ConstVariables.opelModels,
        Skoda: ConstVariables.skodaModels,
        Daewoo: ConstVariables.daewooModels,
      };

      // Return the models for the selected car type
      return carModelsMap[carType] || [];
    },
  },
};
</script>

<style scoped>
.parent2 {
  padding: 20px;
  overflow-x: auto; /* Enable horizontal scrolling if the list overflows */
  width: 100%;
  max-width: 2000px;
}

.horizontal-list {
  list-style-type: none; /* Remove default list styling */
  margin: 0;
  display: flex; /* Make the list horizontal */
  gap: 10px; /* Add spacing between list items */
}

.list-item {
  white-space: nowrap; /* Prevent text from wrapping */
  padding: 8px 12px; /* Add padding for better clickability */
  border: 1px solid #ccc; /* Optional: Add a border */
  border-radius: 4px; /* Optional: Add rounded corners */
  cursor: pointer; /* Show pointer cursor on hover */
  transition: background-color 0.3s ease; /* Smooth hover effect */
}

.list-item:hover {
  background-color: #f0f0f0; /* Change background color on hover */
}

/* Style for selected items */
.list-item.selected {
  background-color: green; /* Green background for selected items */
  color: white; /* White text for better contrast */
}

/* Add these styles to your existing HomeView styles */
.imported-component {
  width: 100%;
  max-width: 1400px;
  margin: 0 0 20px 0; /* Changed from margin: 0 auto to remove centering */
  text-align: left;
  overflow-x: auto;
}

.imported-component ul.horizontal-list {
  display: flex;
  gap: 10px;
  padding: 15px;
  margin: 0;
  list-style: none;
  justify-content: flex-start; /* Ensure left alignment */
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