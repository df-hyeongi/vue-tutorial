<template>
  <video
    width="500"
    height="500"
    @click="onClick"
    @play="onPlay"
    @pause="onPause"
    @seeking="onSeeking"
    @seeked="onSeeked"
    @loadedmetadata="onLoadedData"
    @volumechange="onControlChange"
    @ratechange="onControlChange"
    @fullscreenchange="onControlChange"
    ref="videoRef"
    preload="auto"
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
import { onUnmounted, onMounted } from "vue";
import { MediaEventService } from "../services/media-event-service";

const mediaEventService = new MediaEventService();

function onClick(e: Event) {
  e.preventDefault();
}

function onPlay(e: Event) {
  mediaEventService.createPlayEvent(e.target as HTMLVideoElement);
}

function onPause(e: Event) {
  mediaEventService.createPauseEvent(e.target as HTMLVideoElement);
}

function onSeeked(e: Event) {
  mediaEventService.createSeekedEvent(e.target as HTMLVideoElement);
}

function onSeeking(e: Event) {
  mediaEventService.createSeekingEvent(e.target as HTMLVideoElement);
}

function onLoadedData(e: Event) {
  mediaEventService.initPageIn(e.target as HTMLVideoElement);
}

function handleBeforeUnload() {
  const result = mediaEventService.initPageOut();
  localStorage.setItem("sessionStartTime", JSON.stringify(result));
}

function onControlChange(e: Event) {
  mediaEventService.createControlChangeEvent(e.target as HTMLVideoElement);
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  // document.addEventListener("visibilitychange", handleBeforeUnload.value);
});

onUnmounted(() => {
  console.log("onUnmounted");
  // window.addEventListener("beforeunload", handleBeforeUnload);
  // document.removeEventListener("visibilitychange", handleBeforeUnload.value);
});
</script>
