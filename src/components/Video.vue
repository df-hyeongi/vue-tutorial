<template>
  <video
    width="500"
    height="500"
    @click="onClick"
    @play="onPlay"
    @pause="onPause"
    @seeked="onSeeked"
    @loadedmetadata="onLoadedData"
    ref="videoRef"
    controls
    muted
  >
    <source src="./39611.mp4" type="video/mp4" />
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

function onSeeked(e: Event) {
  videoEventService.createSeekedEvent(e.target as HTMLVideoElement);
}

function onLoadedData(e: Event) {
  videoEventService.initPageIn(e.target as HTMLVideoElement);
}

function handleBeforeUnload() {
  const result = videoEventService.initPageOut();
  localStorage.setItem("sessionStartTime", JSON.stringify(result));
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
