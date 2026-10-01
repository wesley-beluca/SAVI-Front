<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/utils/cn'

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    data-slot="floating-button"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        'fixed z-20 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0',
        props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>
