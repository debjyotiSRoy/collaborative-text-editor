<template>
  <div>
    <h1>Editing Document with ID: {{ this.$route.params.documentId }}</h1>
    <textarea v-model="documentContent"></textarea>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //documentId: '', // ID of the document being edited
        documentContent: '', // Content of the document
      };
    },
    mounted() {
      //console.log(this.documentId);
      console.log(this.$route.params);
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
