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
  import * as automerge from "@automerge/automerge";

  const backendUrl = process.env.VUE_APP_BACKEND_URL;

  export default {
    data() {
      return {
        //documentId: '', // ID of the document being edited
        documentContent: '', // Content of the document
        connectedUsers: [],
        //doc: null // Automerge document
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
          console.log(`user ${userId} left this doc`);
          this.connectedUsers = this.connectedUsers.filter(user => user !== userId);
        }
      });
    },
    beforeUnmount() {
      disconnectWebSocket(this.$store.state.auth.user.userId); // Call the function to disconnect WebSocket
    },
    methods : {
      async fetchDocumentContent() {
        try {
          const documentId = this.$route.params.documentId;
          const response = await axios.get(`${backendUrl}/api/items/${documentId}`);
          const content = response.data.content;
          console.log(content);
          
          // Initialize Automerge document with fetched content
          this.doc = automerge.init();
          this.doc = automerge.change(this.doc, doc => {
            // Check if content is not empty or undefined before assigning
            if (content !== undefined && content !== '') {
              doc.content = content;
            } else {
              doc.content = ''; // Assign an empty string if content is undefined or empty
            }
          });
          //console.log(this.doc.content);

          this.documentContent = content; 
        } catch (error) {
          console.error('Error fetching document content:', error);
        }
      },
      async saveDocumentContent() {
        try {
          const documentId = this.$route.params.documentId;

          // Get the updated content from the Automerge document
          //const updatedContent = this.doc.content;

          // Convert Automerge document to JSON string and save to backend
          const updatedContent = this.doc.content;

          await axios.patch(`${backendUrl}/api/items/${documentId}`, {
            //content: this.documentContent,
            content: updatedContent
          });
          console.log('Document content saved successfully');
        } catch (error) {
          console.error('Error saving document content:', error);
        }
      },
      handleInputChange(event) {
        // Update Automerge document with new text
        this.doc = automerge.change(this.doc, doc => {
          doc.content = event.target.value;
        });
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
