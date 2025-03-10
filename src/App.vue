<template>
  <div :class="isDark ? 'dark-mode' : ''">
      <TopNavBar />
      <BottomNavbar :isDark="isDark" @toggle-theme="toggleTheme" />
    <router-view :isDark="isDark" />
      </div>
</template>

<script>
import BottomNavbar from "./components/secondNavbar.vue";
import TopNavBar from "./components/topNavBar";
export default {
  components: {
    BottomNavbar,
    TopNavBar
  },
  data() {
    return {
      isDark: localStorage.getItem("theme") === "true", // Load theme from localStorage
    };
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem("theme", this.isDark); // Save theme preference
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

span{
  color: green;
}

/* Dark Mode Styles */
.dark-mode {
  background-color: #222;
  color: #fff;
}

</style>
