<template>
  <video
    width="500"
    height="500"
    @click="onClick"
    @play="onPlay"
    @pause="onPause"
    @seeked="onSeeked"
    ref="videoRef"
    controls
    muted
  >
    <source src="./39611.mp4" type="video/mp4" />
  </video>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
</script>
