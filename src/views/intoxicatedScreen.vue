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

      <!-- BAC Level -->
      <p class="text-xl pt-4 font-bold text-red-500">
        BAC Level: {{ bacLevel }}‰
      </p>

      <!-- Driving Estimate -->
      <p v-if="drivingEstimate !== null" class="text-lg pt-4 text-gray-700">
        Estimated time until you can legally drive:
        <span class="font-bold">{{ drivingEstimate }}</span
        >.
      </p>

      <!-- Instruction Text -->
      <p class="text-lg pt-4">
        You seem to be intoxicated, take the receipt to get a free water at the
        bar.
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
import { defineComponent, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "IntoxicatedScreen",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const playerNumber = route.params.player || "unknown"; // Fetch player number from the URL
    const bacLevel = parseFloat(route.query.bac as string) || 0; // Fetch BAC value from query parameter and parse as number

    // Compute the driving estimate
    const drivingEstimate = computed(() => {
      if (!bacLevel) return null;

      const eliminationRate = 0.15; // Average BAC reduction rate per hour (‰/h)
      const legalLimit = 0.5; // Legal BAC limit in ‰
      const hoursNeeded = Math.max(
        0,
        (bacLevel - legalLimit) / eliminationRate
      );

      const hours = Math.floor(hoursNeeded);
      const minutes = Math.round((hoursNeeded - hours) * 60);

      if (hours === 0 && minutes === 0) {
        return "immediately"; // Already below the legal limit
      } else if (hours === 0) {
        return `${minutes} minutes`;
      } else {
        return `${hours} hours and ${minutes} minutes`;
      }
    });

    onMounted(() => {
      setTimeout(() => {
        router.push("/"); // Redirect to the home page after 5 seconds
      }, 15000);
    });

    return {
      playerNumber,
      bacLevel,
      drivingEstimate,
    };
  },
});
</script>

<style scoped>
.font-bold {
  font-family: "Arial", sans-serif; /* Replace with your desired custom font */
}
</style>
