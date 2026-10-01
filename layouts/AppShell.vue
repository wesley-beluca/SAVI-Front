<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Home, ArrowLeftRight, TrendingUp, Wallet, User, Plus } from '@lucide/vue'
import { FloatingButton } from '@/components/ui/floating-button'
import logoMark from '@/static/brand/logo-icon.png'

const route = useRoute()

const abas = [
  { nome: 'inicio', rotulo: 'Início', icone: Home },
  { nome: 'movimentacoes', rotulo: 'Movimentações', icone: ArrowLeftRight },
  { nome: 'evolucao', rotulo: 'Evolução', icone: TrendingUp },
  { nome: 'planejamento', rotulo: 'Planejamento', icone: Wallet },
  { nome: 'perfil', rotulo: 'Perfil', icone: User },
]

// Subpáginas (ex: categorias) declaram em meta.aba qual aba da navegação fica ativa.
const abaAtiva = computed(() => (route.meta.aba as string | undefined) ?? route.name)

const destinoAdicionar = { name: 'movimentacoes', query: { criar: '1' } }
</script>

<template>
  <div class="flex min-h-dvh bg-background">
    <!-- Sidebar (desktop/tablet largo) -->
    <aside
      class="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-card px-4 py-6 md:flex"
    >
      <div class="mb-8 flex items-center gap-2 px-2">
        <img :src="logoMark" alt="SAVi" class="h-8 w-8 object-contain" />
        <span class="text-lg font-semibold text-foreground">SAVi</span>
      </div>

      <nav class="flex flex-1 flex-col gap-1">
        <RouterLink
          v-for="aba in abas"
          :key="aba.nome"
          :to="{ name: aba.nome }"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          :class="{ 'bg-primary/10 text-primary': abaAtiva === aba.nome }"
        >
          <component :is="aba.icone" class="size-5" />
          {{ aba.rotulo }}
        </RouterLink>
      </nav>

      <RouterLink
        :to="destinoAdicionar"
        class="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus class="size-5" />
        Adicionar
      </RouterLink>
    </aside>

    <main class="flex-1 overflow-y-auto pb-20 md:pb-0 md:pl-64">
      <RouterView />
    </main>

    <!-- Bottom tab bar (mobile) -->
    <nav
      class="fixed inset-x-0 bottom-0 border-t bg-background/95 backdrop-blur md:hidden"
      style="padding-bottom: env(safe-area-inset-bottom, 0px)"
    >
      <ul class="grid grid-cols-5">
        <li v-for="aba in abas" :key="aba.nome">
          <RouterLink
            :to="{ name: aba.nome }"
            class="flex flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground transition-colors"
            :class="{ 'text-primary': abaAtiva === aba.nome }"
          >
            <component :is="aba.icone" class="size-5" />
            {{ aba.rotulo }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <FloatingButton
      as-child
      class="right-4 bottom-[calc(5rem_+_env(safe-area-inset-bottom,0px))] md:hidden"
    >
      <RouterLink :to="destinoAdicionar">
        <Plus />
      </RouterLink>
    </FloatingButton>
  </div>
</template>
