<template>
  <div class="w-full max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-4 text-center">
      Reaction & Precision Game
    </h1>
    <div class="relative h-96 w-full border rounded-lg bg-gray-50">
      <!-- Target Circle -->
      <div
        v-if="isTargetVisible"
        :style="circleStyle"
        class="absolute bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        @click="handleClick"
      ></div>
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Scoreboard</h2>
      <ul class="mt-2 text-gray-700">
        <li>Total Score: {{ totalScore }}</li>
        <li>Reaction Time: {{ reactionTime }}ms</li>
        <li>Precision: {{ precision }}%</li>
      </ul>
    </div>
    <button
      class="mt-6 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      @click="startGame"
    >
      Start Game
    </button>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isTargetVisible: false,
      circleStyle: {},
      reactionTime: 0,
      precision: 0,
      totalScore: 0,
      targetStartTime: null,
      targetPosition: { x: 0, y: 0 },
      targetSize: 50,
    };
  },
  methods: {
    startGame() {
      this.resetGame();
      this.spawnTarget();
    },
    resetGame() {
      this.totalScore = 0;
      this.reactionTime = 0;
      this.precision = 0;
    },
    spawnTarget() {
      this.isTargetVisible = true;
      this.targetPosition = {
        x: Math.random() * (300 - this.targetSize) + this.targetSize,
        y: Math.random() * (300 - this.targetSize) + this.targetSize,
      };
      this.circleStyle = {
        left: `${this.targetPosition.x}px`,
        top: `${this.targetPosition.y}px`,
        width: `${this.targetSize}px`,
        height: `${this.targetSize}px`,
      };
      this.targetStartTime = performance.now();
    },
    handleClick(event) {
      const clickX = event.offsetX;
      const clickY = event.offsetY;

      // Calculate reaction time
      const currentTime = performance.now();
      this.reactionTime = Math.round(currentTime - this.targetStartTime);

      // Calculate precision
      const circleCenterX = this.targetPosition.x + this.targetSize / 2;
      const circleCenterY = this.targetPosition.y + this.targetSize / 2;
      const distance = Math.sqrt(
        Math.pow(circleCenterX - clickX, 2) +
          Math.pow(circleCenterY - clickY, 2)
      );
      const maxDistance = this.targetSize / 2;
      this.precision = Math.max(
        0,
        Math.round(100 - (distance / maxDistance) * 100)
      );

      // Update score
      this.totalScore += this.reactionTime + this.precision;

      // Hide target and spawn a new one
      this.isTargetVisible = false;
      setTimeout(() => this.spawnTarget(), 1000); // Delay before next target
    },
  },
};
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
