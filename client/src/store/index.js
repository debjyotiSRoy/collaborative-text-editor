//import Vue from 'vue';
//import Vuex from 'vuex';
//import authModule from './modules/auth'; // Import the auth store module

//Vue.use(Vuex);

//const store = new Vuex.Store(
  //{
  //modules: {
    //auth: authModule // Include the auth store module in the Vuex store
  //}
//}
//);

//export default store;

import { createStore } from 'vuex';
import authModule from './modules/auth'; // Import your auth module (assuming it's located in a modules directory)

const store = createStore({
  modules: {
    auth: authModule // Include the auth store module in the Vuex store
  }
});

export default store;

