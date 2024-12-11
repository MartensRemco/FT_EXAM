<template>
    <p class="text-center text-4xl font-bold pt-14">First pose</p>
    <div class="flex flex-col justify-center items-center">
        <div>
            <img :src="pose1" alt="First Pose" width="300" height="625" />

        </div>
        <button class="bg-[#8B4513] hover:bg-[#53311a] text-white font-bold py-4 px-20 text-2xl rounded-lg"
            @click="goToRoundOne">
            Next
        </button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import pose1 from "@/assets/pose1.svg";

export default defineComponent({
    name: "MoveAndProvePage",
    setup() {
        const router = useRouter();

        // Method to navigate to the gameTwoPlayersScreen
        const goToRoundOne = () => {
            router.push({ name: "roundOne" });
        };

        return {
            goToRoundOne,
            pose1
        };
    },
});
</script>