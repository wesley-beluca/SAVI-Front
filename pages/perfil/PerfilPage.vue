<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Pencil, Landmark, Tag, Bell, Shield, Lock, Info, Sparkles, LogOut, ChevronRight } from '@lucide/vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/store/auth.store'
import EditarPerfilDialog from '@/components/perfil/EditarPerfilDialog.vue'
import {
  DIAS_ANTECEDENCIA_LEMBRETE,
  definirLembretesAtivos,
  lembretesAtivos,
  permissaoNotificacoes,
  solicitarPermissaoNotificacoes,
} from '@/mixins/useLembretesContas'

const authStore = useAuthStore()
const router = useRouter()

const editarAberto = ref(false)
const lembretesLigados = ref(lembretesAtivos())
const permissao = ref(permissaoNotificacoes())

const descricaoLembretes = computed(() => {
  if (!lembretesLigados.value) return 'Desativados'
  if (permissao.value === 'granted') return `Avisa ${DIAS_ANTECEDENCIA_LEMBRETE} dias antes do vencimento`
  if (permissao.value === 'denied') return 'Notificações bloqueadas no navegador. Avisos só dentro do app.'
  if (permissao.value === 'indisponivel') return 'Avisos dentro do app. No iPhone, instale o SAVi para receber notificações.'
  return 'Avisos dentro do app'
})

async function alternarLembretes(ligados: boolean) {
  lembretesLigados.value = ligados
  definirLembretesAtivos(ligados)
  if (ligados) await pedirPermissao()
}

async function pedirPermissao() {
  permissao.value = await solicitarPermissaoNotificacoes()
  if (permissao.value === 'granted') toast.success('Pronto! Você será avisado quando uma conta estiver para vencer.')
}

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
      <li class="flex w-full items-center gap-3 px-3 py-3">
        <Bell class="size-4 shrink-0 text-muted-foreground" />
        <div class="flex flex-1 flex-col">
          <label for="lembretes-contas" class="font-medium">Lembretes de contas</label>
          <span class="text-xs text-muted-foreground">{{ descricaoLembretes }}</span>
          <button
            v-if="lembretesLigados && permissao === 'default'"
            type="button"
            class="self-start text-xs font-medium text-primary hover:underline"
            @click="pedirPermissao"
          >
            Permitir notificações do sistema
          </button>
        </div>
        <Switch id="lembretes-contas" :model-value="lembretesLigados" @update:model-value="alternarLembretes" />
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
