import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import LogoutPage from '../components/LogoutPage.vue';
import DocumentEditor from '../components/DocumentEditor.vue'; // Import the editing component

import App from '../App.vue';
//import UserAuth
// Import other components and set up routes

const routes = [
  { 
    path: '/landing', 
    component: LandingPage 
  },
  { path: '/home', 
    component: App 
  },
  { path: '/logout', 
    component: LogoutPage 
  },
  {
    path: '/document/:documentId', // Dynamic route accepting document ID as a parameter
    name: 'DocumentEditor',
    component: DocumentEditor,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;

