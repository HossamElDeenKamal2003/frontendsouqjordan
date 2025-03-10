<template>
  <nav class="top-navbar">
    <ul class="nav-links">
      <li>
        <a href="#">
          <i class="fas fa-paw"></i> Livestock and Animals
        </a>
      </li>
      <li>
        <a href="#">
          <i class="fas fa-couch"></i> Furniture
        </a>
      </li>
      <li>
        <a href="#">
          <i class="fas fa-mobile-alt"></i> Devices
        </a>
      </li>
      <li>
        <a href="#">
          <i class="fas fa-car"></i> Cars
        </a>
      </li>
      <li>
        <a href="#">
          <i class="fas fa-home"></i> Main
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "TopNavbar",
};
</script>

<style scoped>
/* Top Navigation Bar */
.top-navbar {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 0;
  overflow: hidden;
}

/* Navigation List */
.nav-links {
  list-style: none;
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 0;
  padding: 0.5rem;
  overflow-x: auto; /* Enables horizontal scrolling */
  white-space: nowrap; /* Prevents text from wrapping */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #ddd transparent;
}

/* Hide scrollbar for WebKit (Chrome, Safari) */
.nav-links::-webkit-scrollbar {
  height: 5px;
}

.nav-links::-webkit-scrollbar-track {
  background: transparent;
}

.nav-links::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

/* Navigation Items */
.nav-links li {
  flex: 0 0 auto;
  padding: 0 1rem;
}

.nav-links li a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Icon Styling */
.nav-links li i {
  font-size: 1rem;
  color: green;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    overflow-x: auto; /* Enable horizontal scrolling */
  }
}
</style>
