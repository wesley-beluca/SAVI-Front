<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  ChevronRight,
  CircleCheck,
  Download,
  EllipsisVertical,
  Globe,
  Share,
  Smartphone,
  SquarePlus,
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { marcarApresentacaoVista, useInstalacaoPwa } from '@/mixins/useInstalacaoPwa'

const router = useRouter()
const { plataforma, podeInstalarDireto, instalado, instalar } = useInstalacaoPwa()

const etapa = ref<'escolha' | 'instalar'>('escolha')
const enderecoApp = window.location.origin

const titulo = computed(() => (etapa.value === 'escolha' ? 'Bem-vindo ao SAVi' : 'Instalar o SAVi'))

function continuarNoNavegador() {
  marcarApresentacaoVista()
  router.push({ name: 'login' })
}

async function escolherInstalar() {
  marcarApresentacaoVista()
  etapa.value = 'instalar'

  if (plataforma !== 'desktop' && podeInstalarDireto.value) {
    await instalar()
  }
}
</script>

<template>
  <AuthLayout :titulo="titulo">
    <template v-if="etapa === 'escolha'">
      <p class="text-sm text-muted-foreground">
        Organize receitas, despesas e metas em um só lugar. Como você prefere usar?
      </p>

      <div class="flex flex-col gap-3">
        <button
          type="button"
          class="flex items-center gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted"
          @click="continuarNoNavegador"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-soft-foreground">
            <Globe class="size-5" />
          </span>
          <span class="flex flex-1 flex-col">
            <span class="font-medium">Usar no navegador</span>
            <span class="text-xs text-muted-foreground">Acesse agora mesmo, sem instalar nada.</span>
          </span>
          <ChevronRight class="size-4 text-muted-foreground" />
        </button>

        <button
          type="button"
          class="flex items-center gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted"
          @click="escolherInstalar"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Smartphone class="size-5" />
          </span>
          <span class="flex flex-1 flex-col">
            <span class="font-medium">Instalar no celular</span>
            <span class="text-xs text-muted-foreground">Ícone na tela inicial e abre em tela cheia, como um app.</span>
          </span>
          <ChevronRight class="size-4 text-muted-foreground" />
        </button>
      </div>
    </template>

    <template v-else>
      <div v-if="instalado" class="flex flex-col items-center gap-2 py-2 text-center">
        <CircleCheck class="size-10 text-success" />
        <p class="font-medium">SAVi instalado!</p>
        <p class="text-sm text-muted-foreground">Abra o app pelo ícone na tela inicial do seu dispositivo.</p>
      </div>

      <template v-else-if="plataforma !== 'desktop' && podeInstalarDireto">
        <p class="text-sm text-muted-foreground">
          Toque no botão abaixo e confirme para adicionar o SAVi à tela inicial.
        </p>
        <Button class="w-full" @click="instalar">
          <Download />
          Instalar agora
        </Button>
      </template>

      <template v-else-if="plataforma === 'ios'">
        <p class="text-sm text-muted-foreground">No iPhone ou iPad, a instalação é feita pelo <strong>Safari</strong>:</p>
        <ol class="flex flex-col gap-3 text-sm">
          <li class="flex items-center gap-3">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">1</span>
            <span>Toque em <Share class="inline size-4 align-text-bottom" /> <strong>Compartilhar</strong> na barra do Safari.</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">2</span>
            <span>Escolha <SquarePlus class="inline size-4 align-text-bottom" /> <strong>Adicionar à Tela de Início</strong>.</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">3</span>
            <span>Toque em <strong>Adicionar</strong>. Pronto, o SAVi aparece na sua tela inicial.</span>
          </li>
        </ol>
      </template>

      <template v-else-if="plataforma === 'android'">
        <p class="text-sm text-muted-foreground">No Android, pelo Chrome:</p>
        <ol class="flex flex-col gap-3 text-sm">
          <li class="flex items-center gap-3">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">1</span>
            <span>Toque no menu <EllipsisVertical class="inline size-4 align-text-bottom" /> do navegador.</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">2</span>
            <span>Escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">3</span>
            <span>Confirme. Pronto, o SAVi aparece na sua tela inicial.</span>
          </li>
        </ol>
      </template>

      <template v-else>
        <p class="text-sm text-muted-foreground">Abra este endereço no navegador do seu celular:</p>
        <p class="rounded-lg bg-muted px-3 py-2 text-center font-mono text-sm break-all select-all">{{ enderecoApp }}</p>
        <ul class="flex flex-col gap-2 text-sm text-muted-foreground">
          <li>
            <strong class="text-foreground">iPhone:</strong> no Safari, toque em
            <Share class="inline size-4 align-text-bottom" /> Compartilhar → Adicionar à Tela de Início.
          </li>
          <li>
            <strong class="text-foreground">Android:</strong> no Chrome, toque em
            <EllipsisVertical class="inline size-4 align-text-bottom" /> → Instalar app.
          </li>
        </ul>
        <Button v-if="podeInstalarDireto" variant="outline" class="w-full" @click="instalar">
          <Download />
          Instalar neste computador
        </Button>
      </template>

      <div class="flex flex-col gap-2">
        <Button :variant="instalado ? 'default' : 'ghost'" class="w-full" @click="continuarNoNavegador">
          Continuar no navegador
        </Button>
        <Button v-if="!instalado" variant="link" size="sm" class="self-center" @click="etapa = 'escolha'">
          <ArrowLeft />
          Voltar
        </Button>
      </div>
    </template>
  </AuthLayout>
</template>
