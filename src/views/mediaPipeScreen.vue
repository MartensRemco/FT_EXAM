<template>
  <div>
    <h1>Pose detection using the MediaPipe PoseLandmarker task</h1>

    <section v-if="poseLandmarkerLoaded" id="demos">
      <h2>Demo: Webcam continuous pose landmarks detection</h2>
      <p>
        Stand in front of your webcam to get real-time pose landmarker
        detection. Click <b>enable webcam</b> below and grant access to the
        webcam if prompted.
      </p>

      <div id="liveView" class="videoView">
        <button @click="enableCam" class="mdc-button mdc-button--raised" ref="webcamButton">
          <span class="mdc-button__ripple"></span>
          <span class="mdc-button__label">{{
            webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE WEBCAM"
          }}</span>
        </button>

        <div style="position: relative">
          <video ref="webcam" id="webcam" style="width: 100%; height: 100%; position: absolute" autoplay
            playsinline></video>
          <canvas ref="outputCanvas" id="output_canvas" width="1280" height="720"
            style="position: absolute; left: 0px; top: 0px"></canvas>
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
      images: [
        {
          src: "https://assets.codepen.io/9177687/woman-ge0f199f92_640.jpg",
          title: "Click to get detection!",
        },
        {
          src: "https://assets.codepen.io/9177687/woman-g1af8d3deb_640.jpg",
          title: "Click to get detection!",
        },
      ],
    };
  },
  mounted() {
    this.createPoseLandmarker();
  },
  methods: {
    async createPoseLandmarker() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        runningMode: this.runningMode,
        numPoses: 2,
      });
      this.poseLandmarkerLoaded = true;
    },

    async handleClick(event) {
      if (!this.poseLandmarker) {
        console.log("Wait for poseLandmarker to load before clicking!");
        return;
      }

      if (this.runningMode === "VIDEO") {
        this.runningMode = "IMAGE";
        await this.poseLandmarker.setOptions({ runningMode: "IMAGE" });
      }

      // Remove previous canvases
      const allCanvas =
        event.target.parentNode.getElementsByClassName("canvas");
      for (let i = allCanvas.length - 1; i >= 0; i--) {
        allCanvas[i].parentNode.removeChild(allCanvas[i]);
      }

      // Detect pose in image
      const img = event.target;
      img.crossOrigin = "anonymous"; // Explicitly set crossOrigin attribute for image
      this.poseLandmarker.detect(img, (result) => {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("class", "canvas");
        canvas.setAttribute("width", img.naturalWidth + "px");
        canvas.setAttribute("height", img.naturalHeight + "px");
        canvas.style =
          "left: 0px;" +
          "top: 0px;" +
          "width: " +
          img.width +
          "px;" +
          "height: " +
          img.height +
          "px;";
        img.parentNode.appendChild(canvas);

        const canvasCtx = canvas.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);

        for (const landmark of result.landmarks) {
          drawingUtils.drawLandmarks(landmark, {
            radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
          });
          drawingUtils.drawConnectors(
            landmark,
            PoseLandmarker.POSE_CONNECTIONS
          );
        }
      });
    },

    async enableCam() {
      if (!this.poseLandmarker) {
        console.log("Wait! poseLandmarker not loaded yet.");
        return;
      }

      this.webcamRunning = !this.webcamRunning;

      // Access the button using the ref
      const webcamButton = this.$refs.webcamButton;
      webcamButton.querySelector(".mdc-button__label").innerText = this
        .webcamRunning
        ? "DISABLE PREDICTIONS"
        : "ENABLE WEBCAM";

      if (this.webcamRunning) {
        const constraints = {
          video: true,
        };

        const videoElement = this.$refs.webcam;
        const canvasElement = this.$refs.outputCanvas;
        const canvasCtx = canvasElement.getContext("2d");

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        videoElement.addEventListener("loadeddata", () =>
          this.predictWebcam(videoElement, canvasCtx)
        );
      }
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
      this.poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        for (const landmark of result.landmarks) {
          const drawingUtils = new DrawingUtils(canvasCtx);
          drawingUtils.drawLandmarks(landmark, {
            radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
          });
          drawingUtils.drawConnectors(
            landmark,
            PoseLandmarker.POSE_CONNECTIONS
          );
        }

        canvasCtx.restore();
      });

      if (this.webcamRunning) {
        window.requestAnimationFrame(() =>
          this.predictWebcam(video, canvasCtx)
        );
      }
    },
  },
};
</script>

<style scoped>
.videoView {
  position: relative;
}

.mdc-button {
  margin: 10px;
  padding: 10px 20px;
}

.canvas {
  position: absolute;
  left: 0px;
  top: 0px;
}

.detectOnClick {
  cursor: pointer;
}

#liveView {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
