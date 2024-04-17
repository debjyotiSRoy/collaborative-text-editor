<template>
  <div>
    <h1>User {{this.$store.state.auth.user.userId}} Editing Document with ID: {{ this.$route.params.documentId }}</h1>
    <textarea v-model="documentContent" @input="handleInputChange"></textarea>
    <p>Connected Users: {{ connectedUsers.join(', ') }}</p>
  </div>
</template>

<script>
  import axios from 'axios';
  import { connectToWebSocket, joinDocumentSession, disconnectWebSocket, sendDocumentSession } from '@/services/WebSocketService';
  import * as automerge from "@automerge/automerge";

  const backendUrl = process.env.VUE_APP_BACKEND_URL;
  // In your Vue component
  const timeout = process.env.VUE_APP_TIMEOUT ? parseInt(process.env.VUE_APP_TIMEOUT) : 1000;
  console.log('timeout', timeout)


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

      // Listen for remote changes from WebSocket
      socket.on('remoteChanges', ({ documentId, lastLocalChange, doc }) => {
        console.log("information received about doc:", documentId)
        if (documentId == this.$route.params.documentId) {
          console.log('changes received from server:', lastLocalChange);
          let remote_doc = automerge.from(doc)
          console.log('doc received from server', remote_doc)
          const lastLocalChangeConverted = new Uint8Array(lastLocalChange);
          console.log('after convert what received from server: ', lastLocalChangeConverted);
          //this.applyRemoteChanges(lastLocalChangeConverted, remote_doc);
          // Introduce a delay of 1000 milliseconds (1 second) before applying changes
          setTimeout(() => {
            this.applyRemoteChanges(lastLocalChangeConverted, remote_doc);
          }, timeout);
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

        // Send changes to the server via WebSocket
        const lastLocalChange = automerge.getLastLocalChange(this.doc);
        this.sendChangesToServer(lastLocalChange);
        //this.doc = automerge.applyChanges(this.doc, lastLocalChange);
      },
      sendChangesToServer(lastLocalChange) {
        // Send changes to the server via WebSocket
        console.log('last local change that will be sent to server (Inside DocumentEditor):', lastLocalChange);
        // let doc3 = automerge.applyChanges(this.doc, [lastLocalChange])[0]
        // console.log("created a doc3, by applying the lastLocalChange made to doc to the doc:, doc now", doc3.content)
        console.log("the doc that is sent to the server: ", this.doc)
        console.log("*******")

        sendDocumentSession(this.$route.params.documentId,lastLocalChange, automerge.clone(this.doc));
      },
      applyRemoteChanges(changes, remote_doc) {
        // Apply remote changes to the local Automerge document

        let doc4 = automerge.applyChanges(automerge.clone(this.doc), [changes])[0];
        console.log("local:", this.doc.content, "\n remote: ", remote_doc.content)
        let doc3 = automerge.merge(automerge.init(), automerge.clone(remote_doc));
        // Update the document content to reflect the changes
        this.documentContent = doc3.content;
        console.log("After applying remote changes, \n doc3: ", doc3.content, "\n doc4: ", doc4.content)
        console.log("#############")
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
