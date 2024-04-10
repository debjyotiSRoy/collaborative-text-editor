<template>
  <div>
    <h1>Socket.IO Client</h1>
    <p>Status: {{ status }}</p>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import io from 'socket.io-client';

export default {
  setup() {
    const status = ref('Connecting...');

    const socket = io('http://localhost:5000');

    onMounted(() => {
      socket.on('connect', () => {
        console.log('Connected to server');
        status.value = 'Connected';
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
        status.value = 'Disconnected';
      });
    });

    onUnmounted(() => {
      socket.close();
      console.log('Socket connection closed');
    });

    return { status };
  },
};
</script>

