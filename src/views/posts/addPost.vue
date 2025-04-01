<template>
  <div :class="['shared-parent', { 'dark-mode': isDark }]">
    <div class="menu-container">
      <div class="menu-header">
        <h3 style="color: green;">Add New Offer</h3>
      </div>
      <ul class="menu-list">
        <li class="menu-item" v-for="(item, index) in menuItems" :key="index">
          <a href="/region" class="menu-link">
            <span class="icon">{{ item.icon }}</span>
            <span class="text">{{ item.text }}</span>
            <span class="arrow">→</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "sharedComponent",
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuItems: [
        { icon: "🚗", text: "Cars" },
        { icon: "🚚", text: "Building" },
        { icon: "🚴", text: "Devices" },
        { icon: "🏢", text: "Jobs" },
        { icon: "📱", text: "Furniture" },
        { icon: "🐑", text: "Personal Accessories" },
        { icon: "🛒", text: "other" },
      ]
    };
  },
};
</script>

<style scoped>
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
  height: calc(100vh - 40px); /* Account for padding */
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
  height: calc((100vh - 40px) / 14); /* Half of item height */
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
  height: calc((100vh - 40px) / 8); /* Exactly 1/7th of viewport */
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
  .menu-container {
    width: 90vw;
    padding: 30px;
    height: calc(100vh - 60px);
  }

  .menu-header {
    height: calc((100vh - 60px) / 14);
  }

  .menu-item {
    height: calc((100vh - 60px) / 8);
  }

  .icon, .arrow {
    font-size: 80px;
    width: 80px;
  }
}

@media (max-width: 992px) {
  .icon, .arrow {
    font-size: 60px;
    width: 60px;
  }

  .text {
    font-size: 1.1em;
  }
}

@media (max-width: 768px) {
  .menu-container {
    padding: 25px;
    height: calc(100vh - 50px);
  }

  .menu-header {
    height: calc((100vh - 50px) / 14);
  }

  .menu-item {
    height: calc((100vh - 50px) / 8);
  }

  .icon, .arrow {
    font-size: 50px;
    width: 50px;
  }

  .text {
    font-size: 1em;
  }
}

@media (max-width: 576px) {
  .menu-container {
    padding: 20px;
    border-radius: 15px;
    height: calc(100vh - 40px);
  }

  .menu-header {
    height: calc((100vh - 40px) / 14);
  }

  .menu-item {
    height: calc((100vh - 40px) / 8);
  }

  .icon, .arrow {
    font-size: 40px;
    width: 40px;
  }

  .text {
    font-size: 0.9em;
    padding: 0 10px;
  }

  .menu-header h3 {
    font-size: 16px;
  }
}

@media (max-width: 400px) {
  .icon, .arrow {
    font-size: 30px;
    width: 30px;
  }

  .text {
    font-size: 0.8em;
  }
}
</style>