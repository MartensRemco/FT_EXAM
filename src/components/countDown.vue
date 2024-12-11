<template>
    <div class="text-xl mt-2">
        <span class="font-bold">{{ countdown }}</span>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

export default {
    setup() {
        const countdown = ref(5);

        // Countdown function
        const startCountdown = () => {
            let count = 5;
            const interval = setInterval(() => {
                if (count > 1) {
                    count--;
                    countdown.value = count;
                } else {
                    clearInterval(interval); // Stop the countdown once it reaches 1
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