<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Pencil, Landmark, Tag, Bell, Shield, Lock, Info, Sparkles, LogOut, ChevronRight } from '@lucide/vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/store/auth.store'
import EditarPerfilDialog from '@/components/perfil/EditarPerfilDialog.vue'

const authStore = useAuthStore()
const router = useRouter()

const editarAberto = ref(false)
const notificacoesAtivas = ref(true)

const iniciais = computed(() => {
  const nome = authStore.usuario?.nome ?? ''
  return nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
})

const opcoesFuturas = [
  { rotulo: 'Segurança', icone: Shield },
  { rotulo: 'Privacidade', icone: Lock },
  { rotulo: 'Ajuda', icone: Info },
]

function emBreve(rotulo: string) {
  toast.info(`${rotulo} chega em breve.`)
}

function verContas() {
  router.push({ name: 'planejamento', query: { aba: 'contas' } })
}

function sair() {
  authStore.sair()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-5 px-4 py-4">
    <div class="flex flex-col items-center gap-2 py-2 text-center">
      <Avatar class="size-16">
        <AvatarFallback class="bg-primary/10 text-lg text-primary">{{ iniciais }}</AvatarFallback>
      </Avatar>
      <div>
        <p class="text-base font-semibold">{{ authStore.usuario?.nome }}</p>
        <p class="text-sm text-muted-foreground">{{ authStore.usuario?.email }}</p>
      </div>
    </div>

    <ul class="flex flex-col divide-y rounded-xl border text-sm">
      <li>
        <button
          type="button"
          class="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted"
          @click="editarAberto = true"
        >
          <Pencil class="size-4 text-muted-foreground" />
          <span class="flex-1 font-medium">Editar dados</span>
          <ChevronRight class="size-4 text-muted-foreground" />
        </button>
      </li>
      <li>
        <button
          type="button"
          class="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted"
          @click="verContas"
        >
          <Landmark class="size-4 text-muted-foreground" />
          <span class="flex-1 font-medium">Contas e cartões</span>
          <ChevronRight class="size-4 text-muted-foreground" />
        </button>
      </li>
      <li>
        <button
          type="button"
          class="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted"
          @click="router.push({ name: 'categorias' })"
        >
          <Tag class="size-4 text-muted-foreground" />
          <span class="flex-1 font-medium">Categorias</span>
          <ChevronRight class="size-4 text-muted-foreground" />
        </button>
      </li>
      <li>
        <label class="flex w-full items-center gap-3 px-3 py-3">
          <Bell class="size-4 text-muted-foreground" />
          <span class="flex-1 font-medium">Notificações</span>
          <Switch v-model="notificacoesAtivas" />
        </label>
      </li>
      <li v-for="opcao in opcoesFuturas" :key="opcao.rotulo">
        <button
          type="button"
          class="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted"
          @click="emBreve(opcao.rotulo)"
        >
          <component :is="opcao.icone" class="size-4 text-muted-foreground" />
          <span class="flex-1 font-medium">{{ opcao.rotulo }}</span>
          <ChevronRight class="size-4 text-muted-foreground" />
        </button>
      </li>
      <li>
        <button
          type="button"
          class="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted"
          @click="router.push({ name: 'sobre' })"
        >
          <Sparkles class="size-4 text-muted-foreground" />
          <span class="flex-1 font-medium">Sobre o SAVi</span>
          <ChevronRight class="size-4 text-muted-foreground" />
        </button>
      </li>
    </ul>

    <button
      type="button"
      class="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
      @click="sair"
    >
      <LogOut class="size-4" />
      Sair da conta
    </button>

    <EditarPerfilDialog v-model:open="editarAberto" />
  </div>
</template>
