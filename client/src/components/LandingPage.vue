<template>
  <div>
    <h1>Hey, start collaborating on your documents</h1>
    <!-- Add any additional content or components for the landing page -->
    <h2>Create New Document</h2>
    <form @submit.prevent="createNewItem">
      <label>Name:</label>
      <input type="text" v-model="newItem.name" required>
      <label>Description:</label>
      <input type="text" v-model="newItem.description" required>
      <button type="submit">Submit</button>
    </form>
    <h2>Your Documents</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Id</th>
          <th>Invite</th> <!-- New column for invite button/link -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in userData" :key="item.name">
          <td><a href="#" @click="goToDocumentEditor(item.itemId)">{{ item.name }}</a></td>
          <td>{{ item.description }}</td>
          <td>{{ item.itemId }}</td>
          <td><button @click="inviteUser(item.itemId)">Invite</button></td> <!-- Button for inviting users -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from 'axios';
  import { 
    getAuth, 
    onAuthStateChanged, 
  } from "firebase/auth";
  // import store from '@/store'; // Import your Vuex store
  const backendUrl = process.env.VUE_APP_BACKEND_URL;

  export default {
    name: 'LandingPage',
    data() {
      return {
        userData: [], // Initialize an empty array to store user-specific data
        newItem: {
          name: '',
          description: ''
        },
        userId: null
      };
    },
    created() {
    },
    mounted() {
      // Listen for authentication state changes
      const auth = getAuth(); // Assuming you have initialized Firebase Authentication
      onAuthStateChanged(auth, (user) => {
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
      this.fetchUserData();
    },
    methods: {
      createNewItem() {
        console.log(this.$store.state.auth.user.userId)
        axios.post(`${backendUrl}/api/items`, {
          ...this.newItem,
          userId: this.userId, // Include user ID in the request body 
        })
          .then(response => {
            // Handle success
            console.log('New item created:', response.data);
            // Optionally, reset the form fields after successful creation
            this.newItem.name = '';
            this.newItem.description = '';
            // Update the list of documents
            this.fetchUserData(); // Assuming you have a fetchUserData method to fetch user-specific data
          })
          .catch(error => {
            // Handle error
            console.error('Error creating item:', error.response.data.error);
          });
      },
      async getData() {
        try {
          const response = await axios.get('${backendUrl}/api/items');
          // Handle the response data here
          console.log(response.data);
        } catch (error) {
          // Handle errors here
          console.error('Error fetching data:', error);
        }
      },
      // Make GET request to fetch user-specific data
      async fetchUserData() {
        try {
          const userId = this.$store.state.auth.user.userId;
          const response = await axios.get(`${backendUrl}/api/items?userId=${userId}`);
          this.userData = response.data; // Store retrieved data in userData array
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching user-specific data:', error);
          throw new Error('Failed to fetch user-specific data');
        }
      },
      goToDocumentEditor(documentId) {
        // Navigate to the editing component with the document ID as a parameter
        this.$router.push({ name: 'DocumentEditor', params: { documentId: documentId } });
      },
      // Method to handle inviting users
      inviteUser(itemId) {
        // Open popup/modal to enter email address
        const emailAddress = prompt('Enter the email address of the user you want to invite:');
        if (emailAddress) {
          // Send invitation to backend API
          this.sendInvitation(itemId, emailAddress);
        }
      },
      // Method to send invitation to backend API
      async sendInvitation(itemId, emailAddress) {
        try {
          // Make API call to send invitation
          const response = await axios.patch(`${backendUrl}/api/items/invite/${itemId}`, 
            { email: emailAddress });
          console.log('Invitation sent successfully:', response.data);
          // Optionally, handle success (e.g., show a message to the user)
          alert('Invitation sent successfully!');
        } catch (error) {
          console.error('Error sending invitation:', error);
          // Optionally, handle error (e.g., show an error message to the user)
          alert('Failed to send invitation. Please try again.');
        }
      }

    }
  }
</script>

<style scoped>
/* Add styles for the landing page */
</style>

