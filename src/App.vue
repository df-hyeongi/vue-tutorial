<template>
  <div>
    <button @click="openNewWindow">Open New Window</button>
    <button @click="sendMessageToWindow">Send Message to New Window</button>
    <p>Message from New Window: {{ windowMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const newWindow = ref(null); // 새 창 참조
const windowMessage = ref(""); // 새 창에서 받은 메시지

// 새 창 열기
const openNewWindow = () => {
  newWindow.value = window.open(
    "http://localhost:5173",
    "_blank",
    "width=600,height=400"
  );
};

// 새 창으로 메시지 보내기
const sendMessageToWindow = () => {
  const message = { type: "greeting", payload: "Hello from Parent!" };
  if (newWindow.value) {
    newWindow.value.postMessage(message, "http://localhost:5173");
  } else {
    console.warn("New window is not open!");
  }
};

// 새 창에서 메시지 수신
const receiveMessageFromWindow = (event) => {
  if (event.origin !== "http://localhost:5173") {
    console.warn("Untrusted message origin:", event.origin);
    return;
  }
  windowMessage.value = event.data.payload;
};

// 이벤트 리스너 등록 및 해제
onMounted(() => {
  window.addEventListener("message", receiveMessageFromWindow);
});

onUnmounted(() => {
  window.removeEventListener("message", receiveMessageFromWindow);
});
</script>
