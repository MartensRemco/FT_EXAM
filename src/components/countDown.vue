<template>
  <div class="text-xl mt-2">
    <span class="font-bold">{{ countdown }}</span>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

export default {
  setup() {
    const countdown = ref<number | string>(5);

    // Countdown function
    const startCountdown = () => {
      let count = 5;
      const interval = setInterval(() => {
        if (count > 1) {
          count--;
          countdown.value = count;
        } else {
          countdown.value = "FREEZE!";
          clearInterval(interval);
        }
      }, 1000);
    };

    // Start the countdown when the component is mounted
    onMounted(() => {
      startCountdown();
    });

    return {
      countdown,
    };
  },
};
</script>
