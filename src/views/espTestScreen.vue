<template>
    <div>
        <h1>BLE Communication with ESP32</h1>
        <button @click="connectToDevice">Connect to BLE Device</button>
        <button @click="startTest" :disabled="!isConnected">Start Test</button>
        <p>Status: {{ status }}</p>
        <p>Result: {{ testResult }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "BlePage",
    setup() {
        const status = ref("Disconnected");
        const isConnected = ref(false);
        const testResult = ref("");
        let bleDevice: BluetoothDevice | null = null;
        let characteristic: BluetoothRemoteGATTCharacteristic | null | undefined = null;

        const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
        const CHARACTERISTIC_UUID = "abcdef01-1234-5678-1234-56789abcdef0";

        // Connect to the BLE device
        async function connectToDevice() {
            try {
                status.value = "Connecting...";
                bleDevice = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                    optionalServices: [SERVICE_UUID],
                });

                const server = await bleDevice.gatt?.connect();
                const service = await server?.getPrimaryService(SERVICE_UUID);
                characteristic = await service?.getCharacteristic(CHARACTERISTIC_UUID);

                if (characteristic) {
                    // Listen for notifications
                    characteristic.addEventListener("characteristicvaluechanged", handleNotifications);
                    await characteristic.startNotifications();

                    status.value = "Connected";
                    isConnected.value = true;
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
                testResult.value = textDecoder.decode(value);
                status.value = "Test Result Received";
            }
        }

        // Start the test by writing to the characteristic
        async function startTest() {
            if (characteristic) {
                const encoder = new TextEncoder();
                const command = encoder.encode("START_TEST");
                await characteristic.writeValue(command);
                status.value = "Test Started";
            }
        }

        return {
            status,
            isConnected,
            testResult,
            connectToDevice,
            startTest,
        };
    },
});
</script>

<style scoped>
button {
    margin-right: 10px;
}
</style>
