<template>
  <audio
    width="500"
    height="500"
    @click="onClick"
    @play="onPlay"
    @pause="onPause"
    @seeked="onSeeked"
    @loadedmetadata="onLoadedData"
    @volumechange="onControlChange"
    @ratechange="onControlChange"
    @fullscreenchange="onControlChange"
    controls
  >
    <source src="./19B.mp3" type="audio/mp3" />
  </audio>
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
  // document.addEventListener("visibilitychange", handleBeforeUnload);
});

onUnmounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  // document.removeEventListener("visibilitychange", handleBeforeUnload);
});
</script>
