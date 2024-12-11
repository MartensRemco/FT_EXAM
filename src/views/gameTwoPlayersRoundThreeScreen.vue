<template>
    <div class="flex flex-row items-center justify-center">
        <img :src="pose1" alt="First Pose" width="100" height="625" />
        <div class="flex flex-col items-center justify-center pt-14">
            <p class="text-center text-4xl font-bold">Round 3</p>
            <p class="text-center text-3xl font-bold">0-0</p>
        </div>
        <img :src="pose1" alt="First Pose" width="100" height="625" />
    </div>

    <div class="flex justify-center w-full items-center pt-10">
        <div class="w-1/2 h-96 bg-gray-500"></div>
    </div>

    <div class="flex flex-col items-center justify-center mt-10">
        <p class="text-xl">Stand still in this pose in</p>
        <Countdown />
    </div>
</template>

<script lang="ts">
import pose1 from "@/assets/pose1.svg";
import Countdown from "@/components/Countdown.vue"; // Import Countdown component

export default {
    components: {
        Countdown, // Register the Countdown component
    },
    setup() {
        return {
            pose1,
        };
    },
};
</script>
