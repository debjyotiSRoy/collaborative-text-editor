<template>
  <div>
    <h1>Editing Document with ID: {{ this.$route.params.documentId }}</h1>
    <textarea v-model="documentContent" @input="handleInputChange"></textarea>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        //documentId: '', // ID of the document being edited
        documentContent: '', // Content of the document
      };
    },
    mounted() {
      // Fetch document content when the component is mounted
      this.fetchDocumentContent();
    },
    methods : {
      async fetchDocumentContent() {
        try {
          const documentId = this.$route.params.documentId;
          const response = await axios.get(`http://localhost:5000/api/items/${documentId}`);
          //console.log(response.data);
          this.documentContent = response.data.content; // Assuming the backend returns content field
        } catch (error) {
          console.error('Error fetching document content:', error);
        }
      },
      async saveDocumentContent() {
        try {
          const documentId = this.$route.params.documentId;
          await axios.patch(`http://localhost:5000/api/items/${documentId}`, {
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
