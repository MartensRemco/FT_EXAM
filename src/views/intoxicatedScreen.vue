<template>
  <div class="h-screen flex flex-col justify-between px-20">
    <!-- Top Section -->
    <div class="text-center pt-14">
      <!-- Header Text -->
      <p class="text-4xl font-bold">Final</p>

      <!-- Player Status -->
      <p class="text-3xl font-bold pt-4">
        Player {{ playerNumber }} is intoxicated!
      </p>

      <!-- Instruction Text -->
      <p class="text-lg pt-4">
        You seem to be intoxicated, take a the receipt to get a free water at
        the bar
      </p>
    </div>

    <!-- Middle Section (Arrow) -->
    <div class="flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-64 w-64 text-black"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>

    <!-- Bottom Section (Blow Below and Button) -->
    <div class="text-center pb-12">
      <!-- Blow Below Text -->
      <p class="text-2xl font-bold pb-6">1 free water</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "FinalScreen",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const playerNumber = route.params.player || "unknown"; // Fetch player number from the URL

    function handleNext() {
      console.log("Starting breathalyzer test for Player:", playerNumber);
      // Add logic for the next steps here
    }
    onMounted(() => {
      setTimeout(() => {
        router.push("/"); // Redirect to the home page after 5 seconds
      }, 5000);
    });
    return {
      playerNumber,
      handleNext,
    };
  },
});
</script>

<style scoped>
.font-bold {
  font-family: "Arial", sans-serif; /* Replace with your desired custom font */
}
</style>
