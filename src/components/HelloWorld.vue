<script setup lang="ts">
import { useAttrs } from "vue";

defineProps<{ text: string }>();

const emits = defineEmits(["create"]);

const handleClick = () => {
  console.log("clicked");
  emits("create", "hello");
};
</script>

<template>
  <button @click="handleClick">font 키우기</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
