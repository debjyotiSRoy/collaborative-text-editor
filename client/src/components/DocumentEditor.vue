<template>
  <div>
    <h1>User {{this.$store.state.auth.user.userId}} Editing Document with ID: {{ this.$route.params.documentId }}</h1>
    <textarea v-model="documentContent" @input="handleInputChange"></textarea>
    <p>Connected Users: {{ connectedUsers.join(', ') }}</p>
  </div>
</template>

<script>
  import axios from 'axios';
  import { connectToWebSocket, joinDocumentSession, disconnectWebSocket } from '@/services/WebSocketService';
  const backendUrl = process.env.VUE_APP_BACKEND_URL;

  export default {
    data() {
      return {
        //documentId: '', // ID of the document being edited
        documentContent: '', // Content of the document
        connectedUsers: []
      };
    },
    mounted() {
      const socket = connectToWebSocket();

      socket.on('connectedUsers', (users) => {
        this.connectedUsers = users;
      });

      joinDocumentSession(this.$route.params.documentId , this.$store.state.auth.user.userId);

      // Fetch document content when the component is mounted
      this.fetchDocumentContent();

      // Listen for userJoined event and update connectedUsers
      socket.on('userJoined', ({ documentId, userId }) => {
        if (documentId === this.$route.params.documentId) {
          this.connectedUsers.push(userId);
        }
      });

      // Listen for userLeft event and update connectedUsers
      socket.on('userLeft', ({ documentId, userId }) => {
        if (documentId === this.$route.params.documentId) {
          this.connectedUsers = this.connectedUsers.filter(user => user !== userId);
        }
      });
    },
    beforeUnmount() {
      disconnectWebSocket(); // Call the function to disconnect WebSocket
    },
    methods : {
      async fetchDocumentContent() {
        try {
          const documentId = this.$route.params.documentId;
          const response = await axios.get(`${backendUrl}/api/items/${documentId}`);
          //console.log(response.data);
          this.documentContent = response.data.content; // Assuming the backend returns content field
        } catch (error) {
          console.error('Error fetching document content:', error);
        }
      },
      async saveDocumentContent() {
        try {
          const documentId = this.$route.params.documentId;
          await axios.patch(`${backendUrl}/api/items/${documentId}`, {
            content: this.documentContent,
          });
          console.log('Document content saved successfully');
        } catch (error) {
          console.error('Error saving document content:', error);
        }
      },
      handleInputChange() {
        // Automatically save changes when the user types
        this.saveDocumentContent();
      },
    }
  }
</script>

<style>
/* Add styling for the editing area if needed */
textarea {
  width: 100%;
  height: 400px;
}
</style>
