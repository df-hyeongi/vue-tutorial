<script setup lang="ts">
import { ref, unref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";

const text = ref("hello world");
const textFontSize = ref(1);

// unref 사용
// https://ko.vuejs.org/api/reactivity-utilities#unref
console.log("unref", unref(text));
// value 사용
console.log("value", text.value);

const create = (text: string) => {
  console.log("create", text);
};
</script>

<!-- APP.vue -->
<template>
  <input v-model="text" />
  <div :style="{ fontSize: textFontSize + 'em' }">
    <HelloWorld :text="text" @create="create" class="hello" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
