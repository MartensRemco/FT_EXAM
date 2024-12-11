<template>
  <div class="flex flex-row items-center justify-center">
    <img :src="pose1" alt="First Pose" width="100" height="625" />
    <div class="flex flex-col items-center justify-center pt-14">
      <p class="text-center text-4xl font-bold">Round 1</p>
      <p class="text-center text-3xl font-bold">0-0</p>
    </div>
    <img :src="pose1" alt="First Pose" width="100" height="625" />
  </div>

  <div class="flex justify-center w-full items-center pt-10">
    <mediaPipeScreen />
  </div>
</template>

<script lang="ts">
import pose1 from "@/assets/pose1.svg";
import Countdown from "@/components/countDown.vue";
import mediaPipeScreen from "@/views/mediaPipeScreen.vue";

export default {
  components: {
    mediaPipeScreen,
  },
  setup() {
    return {
      pose1,
    };
  },
};
</script>
