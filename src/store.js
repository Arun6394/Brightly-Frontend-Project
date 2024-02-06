// store.js

// import Vue from 'vue';
//import Vuex from 'vuex';
import { createStore } from 'vuex';

//Vue.use(Vuex);

export default createStore({
  state: {
    loadResultMethod: null,
  },
  mutations: {
    setLoadResultMethod(state, method) {
      state.loadResultMethod = method;
    },
  },
});
