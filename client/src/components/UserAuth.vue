<template>
  <div>
    <div v-if="!user">
      <h2>User Registration</h2>
      <input type="email" v-model="email" placeholder="Email">
      <input type="password" v-model="password" placeholder="Password">
      <button @click="register">Register</button>
      <hr>
      <h2>User Login</h2>
      <input type="email" v-model="loginEmail" placeholder="Email">
      <input type="password" v-model="loginPassword" placeholder="Password">
      <button @click="login">Login</button>
    </div>
    <div v-else>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
  import { initializeApp } from 'firebase/app';
  import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
  } from "firebase/auth";
  import { firebaseConfig } from './config';
  // import { createStore } from 'vuex';

  initializeApp(firebaseConfig);

  const auth = getAuth();

  export default {
    name: 'UserAuth',
    data() {
      return {
        email: '',
        password: '',
        loginEmail: '',
        loginPassword: '',
        user: null
      };
    },
    
    mounted() {
      // Check if user is already logged in
      //onAuthStateChanged(auth, user => {
        //this.user = user;
      //});

      // Listen for authentication state changes
      const auth = getAuth(); // Assuming you have initialized Firebase Authentication
      onAuthStateChanged(auth, (user) => {
        this.user = user
        if (user) {
          // User is signed in, access the UID
          this.userId = user.uid;
          // If user is authenticated, update user information in the store
          this.$store.dispatch('auth/updateUser', {
            userId: user.uid,
            email: user.email,
            // Other user information you may need
          });
        } else {
          // User is signed out, reset userId
          this.userId = null;
          // If user is not authenticated, clear user information in the store
          this.$store.dispatch('auth/updateUser', null);
        }
      });
    },
    methods: {
      register() {
        createUserWithEmailAndPassword(auth, this.email, this.password)
          .then(userCredential => {
            console.log('User registered:', userCredential.user);
          })
          .catch(error => {
            console.error('Registration failed:', error);
          });
      },
      login() {
        signInWithEmailAndPassword(auth, this.loginEmail, this.loginPassword)
          .then(userCredential => {
            console.log('User logged in:', userCredential.user);
            // Redirect to landing page after successful login
            this.$router.push('/landing');
          })
          .catch(error => {
            console.error('Login failed:', error);
          });
      },
      logout() {
        signOut(auth)
          .then(() => {
            console.log('User logged out');
            // Clear authentication tokens or flags after logout
            localStorage.removeItem('authToken');
            // Reset user data property to null after logout
            this.user = null;
            // Navigate to the login page after logout
            this.$router.push('/logout');
          })
          .catch(error => {
            console.error('Logout failed:', error);
          });
      }
    }
  }
</script>

