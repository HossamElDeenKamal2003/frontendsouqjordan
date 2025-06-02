import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from '../vuetify';
import i18n from './il8n'; // Import vue-i18n configuration

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap's JavaScript bundle
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Toastify
import { Vue3Toastify } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Create Vue app instance
const app = createApp(App);

// Use plugins
app.use(vuetify)
    .use(store)
    .use(router)
    .use(i18n) // Add vue-i18n
    .use(Vue3Toastify, {
            autoClose: 3000,
            position: 'top-right',
            theme: 'light',
            transition: 'slide',
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 60,
            showCloseButtonOnHover: false,
            closeButton: 'button',
            icon: true,
            rtl: i18n.global.locale === 'ar', // Set initial RTL based on locale
            toastClassName: 'custom-toast',
            bodyClassName: ['custom-toast-body'],
    })
    .mount('#app');