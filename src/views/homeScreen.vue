<template>
    <p class="text-center color-black font-customFont pt-14 text-7xl pb-96">
        Move & prove
    </p>
    <div class="flex flex-col justify-center items-center space-y-4">
        <!-- 1 Player Button -->
        <button class="bg-[#8B4513] hover:bg-[#53311a] text-white font-bold py-4 px-28 text-2xl rounded-lg">
            1 player
        </button>

        <!-- 2 Players Button with route push -->
        <button class="bg-[#8B4513] hover:bg-[#53311a] text-white font-bold py-4 px-28 text-2xl rounded-lg"
            @click="goToGameTwoPlayers">
            2 players
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
    name: "MoveAndProvePage",
    setup() {
        const router = useRouter();

        // Method to navigate to the gameTwoPlayersScreen
        const goToGameTwoPlayers = () => {
            router.push({ name: "game2" });
        };

        return {
            goToGameTwoPlayers,
        };
    },
});
</script>
