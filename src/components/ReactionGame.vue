<template>
  <div class="h-screen flex flex-col items-center justify-center bg-gray-100">
    <h1 class="text-3xl font-bold mb-6">Reaction & Precision Game</h1>
    <div class="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
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
          <li><strong>Total Score:</strong> {{ totalScore }}</li>
          <li><strong>Reaction Time:</strong> {{ reactionTime }}ms</li>
          <li><strong>Precision:</strong> {{ precision }}%</li>
        </ul>
      </div>
      <button
        class="mt-6 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        @click="startGame"
      >
        Start Game
      </button>
    </div>
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
      const containerSize = 384; // Height/Width of the container in Tailwind (h-96 = 384px)
      this.targetPosition = {
        x:
          Math.random() * (containerSize - this.targetSize) +
          this.targetSize / 2,
        y:
          Math.random() * (containerSize - this.targetSize) +
          this.targetSize / 2,
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
      // Get absolute click position
      const clickX = event.clientX;
      const clickY = event.clientY;

      // Get circle's absolute center position
      const circleRect = event.target.getBoundingClientRect();
      const circleCenterX = circleRect.left + circleRect.width / 2;
      const circleCenterY = circleRect.top + circleRect.height / 2;

      // Calculate distance from click to center of circle
      const distance = Math.sqrt(
        Math.pow(circleCenterX - clickX, 2) +
          Math.pow(circleCenterY - clickY, 2)
      );
      const maxDistance = this.targetSize / 2;

      // Calculate precision percentage
      this.precision = Math.max(
        0,
        Math.round(100 - (distance / maxDistance) * 100)
      );

      // Calculate reaction time
      const currentTime = performance.now();
      this.reactionTime = Math.round(currentTime - this.targetStartTime);

      // Update score
      this.totalScore += this.precision;

      // Hide and respawn target
      this.isTargetVisible = false;
      setTimeout(() => this.spawnTarget(), 1000); // 1-second delay
    },
  },
};
</script>

<style>
/* Optional global styling */
body {
  margin: 0;
  font-family: "Inter", sans-serif;
}
</style>
