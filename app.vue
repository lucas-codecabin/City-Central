<script setup>
import "primeicons/primeicons.css";
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
:root {
  --p-inputtext-hover-border-color: #40b9bf;
  --p-inputtext-background-color: #40b9bf;
}

.p-message {
  margin: 0;
  padding: 0;
  background-color: transparent;
  outline: none;
}

.p-message-content {
  margin: 0;
  padding: 0;
}

.p-message-text {
  font-size: 12px;
  margin-left: 16px;
  color: oklch(57.7% 0.245 27.325);
}
</style>
