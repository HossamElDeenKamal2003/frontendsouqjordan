<template>
  <div :class="['shared-parent', { 'dark-mode': isDark }]">
    <div class="menu-container">
      <div class="menu-header">
        <h3 style="color: green;">Add New Offer</h3>
      </div>
      <ul class="menu-list">
        <li class="menu-item">
          <a href="/region" class="menu-link">
            <span class="icon">🚗</span>
            <span class="text">Cars</span>
            <span class="arrow">→</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="/region" class="menu-link">
            <span class="icon">🚚</span>
            <span class="text">Building</span>
            <span class="arrow">→</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="/region" class="menu-link">
            <span class="icon">🚴</span>
            <span class="text">Devices</span>
            <span class="arrow">→</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="/region" class="menu-link">
            <span class="icon">🏢</span>
            <span class="text">Jobs</span>
            <span class="arrow">→</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="/region" class="menu-link">
            <span class="icon">📱</span>
            <span class="text">Furniture</span>
            <span class="arrow">→</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="/region" class="menu-link">
            <span class="icon">🐑</span>
            <span class="text">Personal Accessories</span>
            <span class="arrow">→</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="/region" class="menu-link">
            <span class="icon">🛒</span>
            <span class="text">other</span>
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
}

.menu-header h3 {
  font-size: 18px;
  font-weight: bold;
  color: green;
}

.dark-mode .menu-header h3 {
  color: #4CAF50;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: #333;
}

.menu-link {
  display: flex;
  align-items: center;
  width: 100%;
  text-decoration: none;
  color: inherit;
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
}

.dark-mode .icon {
  filter: brightness(0.9);
}

.text {
  flex-grow: 1;
  font-size: 1.2em;
  padding: 0 15px;
}

.arrow {
  font-size: 100px;
  color: #007bff;
}

.dark-mode .arrow {
  color: #4dabf7;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .menu-container {
    width: 90vw;
    padding: 30px;
  }
}

@media (max-width: 992px) {
  .icon, .arrow {
    font-size: 80px;
  }
}

@media (max-width: 768px) {
  .menu-container {
    width: 95vw;
    padding: 25px;
  }

  .icon, .arrow {
    font-size: 60px;
  }

  .text {
    font-size: 1.1em;
  }
}

@media (max-width: 576px) {
  .menu-container {
    padding: 20px;
    border-radius: 15px;
  }

  .icon, .arrow {
    font-size: 40px;
  }

  .text {
    font-size: 1em;
    padding: 0 10px;
  }

  .menu-header h3 {
    font-size: 16px;
  }

  .menu-item {
    padding: 8px 0;
  }
}

@media (max-width: 400px) {
  .icon, .arrow {
    font-size: 30px;
  }

  .text {
    font-size: 0.9em;
  }
}
</style>