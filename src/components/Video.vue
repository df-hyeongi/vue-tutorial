<template>
  <!-- <video @click="onClick" @play="onPlay" @seeked="onSeeked" ref="videoRef" controls> -->
  <video @pause="onPause" ref="videoRef" controls>
    <source src="./rabbit320.mp4" type="video/mp4" />
  </video>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { utilFloorToDecimals } from "../utils";
import { VideoEventService } from "../services/video-event-service";

const videoRef = ref<HTMLVideoElement | null>(null);

let firstSeekedValue: number | null = null; // 첫 번째 seeked 값
let lastSeekedValue: number | null = null; // 마지막 seeked 값

// function onPlay(e: Event) {
//   const videoEventService = new VideoEventService();
//   videoEventService.createPlayEvent(e.target as HTMLVideoElement);
// }

function onPause(e: Event) {
  VideoEventService.createPauseEvent(e.target as HTMLVideoElement);
}

function onSeeked(videoInstance: HTMLVideoElement) {
  const currentTime = utilFloorToDecimals(videoInstance.currentTime);

  if (firstSeekedValue === null) {
    firstSeekedValue = currentTime; // 첫 번째 값 기록
    console.log("First seeked value:", firstSeekedValue);
  }

  lastSeekedValue = currentTime; // 마지막 값 업데이트
  console.log("Last seeked value:", lastSeekedValue);
}
</script>
