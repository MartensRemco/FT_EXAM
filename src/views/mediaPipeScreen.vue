<template>
  <div class="p-4">
    <section v-if="poseLandmarkerLoaded" id="demos">
      <div
        id="liveView"
        class="relative flex flex-col items-center justify-center"
      >
        <div>
          <button
            @click="enableCam"
            class="mdc-button mdc-button--raised bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600"
            ref="webcamButton"
          >
            <span class="mdc-button__ripple"></span>
            <span class="mdc-button__label">
              {{ webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE PREDICTIONS" }}
            </span>
          </button>
        </div>

        <div class="relative mt-4">
          <video
            ref="webcam"
            id="webcam"
            class="object-cover rounded-lg"
            autoplay
            playsinline
          ></video>
          <canvas
            ref="outputCanvas"
            id="output_canvas"
            width="1280"
            height="720"
            class="absolute top-0 left-0 rounded-lg"
          ></canvas>
        </div>

        <!-- Countdown timer and movement status -->
        <div v-if="countdownStarted" class="mt-4">
          <h3 class="text-xl">Starting in: {{ countdown }}</h3>
        </div>
        <div v-if="movementStatus" class="mt-4">
          <h3 class="text-lg">Movement Status: {{ movementStatus }}</h3>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="js">
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

export default {
  data() {
    return {
      poseLandmarker: null,
      runningMode: "IMAGE",
      webcamRunning: false,
      poseLandmarkerLoaded: false,
      countdown: 5, // Set initial countdown to 5 seconds
      countdownStarted: false,
      movementStatus: "",
      prevLandmarks: null,
      countdownIntervalId: null
    };
  },
  mounted() {
    this.createPoseLandmarker();
    this.enableCam();
  },
  methods: {
    async createPoseLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        console.log("Vision model loaded successfully.");
        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: "GPU",
          },
          runningMode: this.runningMode,
          numPoses: 2,
        });
        console.log("PoseLandmarker initialized.");
        this.poseLandmarkerLoaded = true;
      } catch (error) {
        console.error("Error initializing PoseLandmarker:", error);
      }
    },
    async enableCam() {
      if (!this.poseLandmarker) {
        console.log("Wait! poseLandmarker not loaded yet.");
        return;
      }

      this.webcamRunning = true;

      const webcamButton = this.$refs.webcamButton;
      webcamButton.querySelector(".mdc-button__label").innerText = "DISABLE PREDICTIONS"; // Ensure the label is updated immediately

      const constraints = {
        video: true,
      };

      const videoElement = this.$refs.webcam;
      const canvasElement = this.$refs.outputCanvas;
      const canvasCtx = canvasElement.getContext("2d");

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;
      videoElement.addEventListener("loadeddata", () => {
        this.startCountdown(videoElement, canvasCtx);
      });
    },

    startCountdown(videoElement, canvasCtx) {
      this.countdownStarted = true;
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.startPoseDetection(videoElement, canvasCtx);
        }
      }, 1000);
    },

    startPoseDetection(videoElement, canvasCtx) {
      this.movementStatus = "Tracking your pose...";

      // Start pose detection after countdown
      this.predictWebcam(videoElement, canvasCtx);
    },

async predictWebcam(video, canvasCtx) {
  const canvasElement = this.$refs.outputCanvas;
  const videoHeight = "360px";
  const videoWidth = "480px";

  canvasElement.style.height = videoHeight;
  video.style.height = videoHeight;
  canvasElement.style.width = videoWidth;
  video.style.width = videoWidth;

  if (this.runningMode === "IMAGE") {
    this.runningMode = "VIDEO";
    await this.poseLandmarker.setOptions({ runningMode: "VIDEO" });
  }

  const startTimeMs = performance.now();
  try {
    this.poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
      if (result && result.landmarks) {
        // Track specific landmarks after countdown
        const trackedLandmarks = [
          29, 30, 27, 28, 23, 24, 21, 22, 11, 12
        ];

        const visibleLandmarks = trackedLandmarks.filter((index) => {
          const landmark = result.landmarks[index];
          return landmark && landmark.visibility > 0.5; // visibility threshold
        });

        if (visibleLandmarks.length > 0) {
          this.movementStatus = "Movement detected!";
        } else {
          this.movementStatus = "No movement detected.";
        }

        // Log the landmarks' X, Y, Z values and visibility
        console.log("Landmarks Data:");
        console.log(result.landmarks)
        result.landmarks.forEach((landmark, index) => {
          if (landmark) {
            console.log(`Landmark ${trackedLandmarks[index]}: X: ${landmark[trackedLandmarks[index]].x}, Y: ${landmark[trackedLandmarks[index]].y}, Z: ${landmark[trackedLandmarks[index]].z}`);
          }
        });

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Draw landmarks and connectors on the canvas
        const drawingUtils = new DrawingUtils(canvasCtx);
        for (const landmark of result.landmarks) {
          if (landmark) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
          }
        }

        canvasCtx.restore();
      } else {
        console.error("No landmarks detected.");
      }
    });
  } catch (error) {
    console.error("Error during pose detection:", error);
  }

  if (this.webcamRunning) {
    window.requestAnimationFrame(() => this.predictWebcam(video, canvasCtx));
  }
}

  },
};
</script>
