<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <ReactionGame />
  </div>
</template>

<script lang="ts">
import ReactionGame from "../components/ReactionGame.vue";

export default {
  components: {
    ReactionGame,
  },
};
</script>
