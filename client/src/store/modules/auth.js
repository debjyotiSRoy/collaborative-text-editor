const authModule = {
  namespaced: true, // Set to true to enable namespace for this module
  state: {
    user: null // Initially no user is authenticated
  },
  mutations: {
    setUser(state, user) {
      state.user = user; // Update the user information in the state
    }
  },
  actions: {
    // Action to update user information when authentication state changes
    async updateUser({ commit }, user) {
      commit('setUser', user); // Commit mutation to update user information
    }
  }
};

export default authModule;

