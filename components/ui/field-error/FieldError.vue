<script setup lang="ts">
defineProps<{
  id?: string
  mensagem?: string
}>()
</script>

<template>
  <p v-if="mensagem" :id="id" role="alert" class="text-xs text-destructive">{{ mensagem }}</p>
</template>
