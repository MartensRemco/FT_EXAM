<template>
    <p class="text-center color-black font-customFont pt-14 text-7xl pb-32">
        Move & prove
    </p>
    <!-- Input Fields -->
    <div class="flex flex-col justify-center items-center space-y-4 pb-10">
        <!-- Gender Dropdown -->
        <div class="flex flex-col items-start">
            <label for="gender" class="text-xl font-semibold pb-2">Gender:</label>
            <select id="gender" v-model="gender" class="border-2 border-gray-300 p-2 rounded-lg w-64">
                <option value="" disabled selected>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>
        <!-- Age Input -->
        <div class="flex flex-col items-start">
            <label for="age" class="text-xl font-semibold pb-2">Age:</label>
            <input id="age" type="number" placeholder="Enter your age" v-model="age"
                class="border-2 border-gray-300 p-2 rounded-lg w-64" />
        </div>
    </div>
    <!-- Buttons -->
    <div class="flex flex-col justify-center items-center space-y-4">
        <button class="bg-[#8B4513] hover:bg-[#53311a] text-white font-bold py-4 px-28 text-2xl rounded-lg"
            @click="goToGameTwoPlayers">
            Play
        </button>
    </div>
    <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
    name: "MoveAndProvePage",
    setup() {
        const router = useRouter();

        // Gender and Age input fields
        const gender = ref("");
        const age = ref<number | null>(null);
        const errorMessage = ref("");

        // Method to navigate to the gameTwoPlayersScreen
        const goToGameTwoPlayers = () => {
            if (!gender.value || !age.value) {
                errorMessage.value = "Please fill in both gender and age before continuing.";
                return;
            }

            // Clear error message if validation passes
            errorMessage.value = "";

            // Navigate to the next page
            router.push({ name: "game2" });
        };

        return {
            gender,
            age,
            errorMessage,
            goToGameTwoPlayers,
        };
    },
});
</script>
