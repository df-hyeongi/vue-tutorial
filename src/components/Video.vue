<template>
  <video
    width="500"
    height="500"
    @click="onClick"
    @play="onPlay"
    @pause="onPause"
    @seeking="onSeeking"
    @loadedmetadata="onLoadedData"
    @volumechange="onControlChange"
    @ratechange="onControlChange"
    @fullscreenchange="onControlChange"
    ref="videoRef"
    controls
  >
    <!-- <source src="./39611.mp4" type="video/mp4" /> -->
    <source
      src="https://d-lcms-res.ds.daekyo.in/resources/724/2024-08-21/39611.mp4?t=Mon Jan 20 2025 13:53:58 GMT+0900 (한국 표준시)"
      type="video/mp4"
    />
  </video>
  <a href="https://www.google.com">google</a>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import { VideoEventService } from "../services/video-event-service";

const videoRef = ref<HTMLVideoElement | null>(null);

const videoEventService = new VideoEventService();

function onClick(e: Event) {
  e.preventDefault();
}

function onPlay(e: Event) {
  videoEventService.createPlayEvent(e.target as HTMLVideoElement);
}

function onPause(e: Event) {
  videoEventService.createPauseEvent(e.target as HTMLVideoElement);
}

function onSeeking(e: Event) {
  videoEventService.createSeekedEvent(e.target as HTMLVideoElement);
}

function onLoadedData(e: Event) {
  videoEventService.initPageIn(e.target as HTMLVideoElement);
}

function handleBeforeUnload() {
  const result = videoEventService.initPageOut();
  localStorage.setItem("sessionStartTime", JSON.stringify(result));
}

function onControlChange(e: Event) {
  videoEventService.createControlChangeEvent(e.target as HTMLVideoElement);
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  // document.addEventListener("visibilitychange", handleBeforeUnload);
});

onUnmounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  // document.removeEventListener("visibilitychange", handleBeforeUnload);
});
</script>
