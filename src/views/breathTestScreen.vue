<template>
  <div class="h-screen flex flex-col justify-between px-20">
    <!-- Top Section -->
    <div class="text-center pt-14">
      <!-- Header Text -->
      <p class="text-4xl font-bold">Final</p>

      <!-- Player Status -->
      <p class="text-3xl font-bold pt-4">Player {{ playerNumber }} loses!</p>

      <!-- Instruction Text -->
      <p class="text-lg pt-4">
        You seem a little intoxicated, take a breathalyzer test
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
      <p class="text-2xl font-bold pb-6">Blow below</p>

      <!-- Display BAC Level if Intoxicated -->
      <p v-if="bacLevel !== null" class="text-xl font-bold text-red-500">
        BAC Level: {{ bacLevel }}‰
      </p>

      <!-- Next Button -->
      <button
        class="bg-[#8B4513] hover:bg-[#53311a] text-white font-bold py-4 px-20 text-2xl rounded-lg"
        @click="handleNext"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "FinalScreen",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const playerNumber = route.params.player || "unknown";
    const status = ref("Disconnected");
    const testResult = ref("");
    const bacLevel = ref<number | null>(null); // BAC level if intoxicated
    let characteristic: BluetoothRemoteGATTCharacteristic | null | undefined =
      null;

    const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
    const CHARACTERISTIC_UUID = "abcdef01-1234-5678-1234-56789abcdef0";

    // Connect to the BLE device
    async function connectToDevice() {
      try {
        status.value = "Connecting...";
        const bleDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [SERVICE_UUID],
        });

        const server = await bleDevice.gatt?.connect();
        const service = await server?.getPrimaryService(SERVICE_UUID);
        characteristic = await service?.getCharacteristic(CHARACTERISTIC_UUID);

        if (characteristic) {
          // Listen for notifications
          characteristic.addEventListener(
            "characteristicvaluechanged",
            handleNotifications
          );
          await characteristic.startNotifications();
          status.value = "Connected";
        }
      } catch (error) {
        console.error("Failed to connect to BLE device:", error);
        status.value = "Connection Failed";
      }
    }

    // Handle incoming BLE notifications
    function handleNotifications(event: Event) {
      const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
      if (value) {
        const textDecoder = new TextDecoder("utf-8");
        const decodedValue = textDecoder.decode(value).trim();
        testResult.value = decodedValue;

        console.log("Received BLE Notification:", decodedValue);
        status.value = "Test Result Received";

        // Navigate based on result
        if (decodedValue === "Intoxicated") {
          bacLevel.value = generateRandomBAC(); // Generate random BAC level
          router.push({
            path: `/intoxicated/${playerNumber}`,
            query: { bac: bacLevel.value.toString() }, // Pass BAC as a query parameter
          });
        } else if (decodedValue === "Sober") {
          router.push(`/sober/${playerNumber}`);
        } else {
          status.value = "Unexpected Test Result";
        }
      }
    }

    // Start the test and handle BLE interaction
    async function handleNext() {
      if (!characteristic) {
        await connectToDevice();
      }

      if (characteristic) {
        const encoder = new TextEncoder();
        const command = encoder.encode("START_TEST");
        await characteristic.writeValue(command);
        status.value = "Test Started";
        console.log("Test Started");
      } else {
        console.error("BLE characteristic is not available.");
      }
    }

    // Generate a believable random BAC value
    function generateRandomBAC(): number {
      return parseFloat((Math.random() * (2.5 - 0.5) + 0.5).toFixed(2));
    }

    return {
      playerNumber,
      status,
      testResult,
      bacLevel,
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
