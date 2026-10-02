<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft, Lightbulb, Users, Code } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import logoMark from '@/static/brand/logo-icon.png'

const creditos = [
  { rotulo: 'Idealização', nomes: 'Sarah Cristina Campos Fonseca', icone: Lightbulb },
  {
    rotulo: 'Estruturação',
    nomes: 'Vinicius Diniz do Nascimento, Ana Julia Pepe, Isabella Esteves e Sarah Cristina Campos Fonseca',
    icone: Users,
  },
  { rotulo: 'Desenvolvimento', nomes: 'Wesley Beluca', icone: Code },
]
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-5 px-4 py-4">
    <div class="flex items-center gap-2">
      <Button as-child variant="ghost" size="icon" aria-label="Voltar para o perfil">
        <RouterLink :to="{ name: 'perfil' }">
          <ArrowLeft />
        </RouterLink>
      </Button>
      <h1 class="flex-1 text-lg font-semibold">Sobre o SAVi</h1>
    </div>

    <div class="flex flex-col items-center gap-2 py-2 text-center">
      <img :src="logoMark" alt="SAVi" class="size-16 object-contain" />
      <p class="text-base font-semibold">SAVi</p>
    </div>

    <div class="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
      <p>
        O SAVi nasceu a partir do projeto de pesquisa sobre educação financeira e endividamento familiar, com a
        proposta de transformar conhecimento em uma ferramenta prática para o dia a dia. A ideia surgiu da percepção de
        que muitas pessoas possuem dificuldade para organizar suas finanças, acompanhar gastos e compreender como suas
        decisões de consumo afetam o orçamento ao longo do tempo.
      </p>
      <p>
        Idealizado por Sarah Cristina Campos Fonseca, o aplicativo foi estruturado em conjunto por Vinicius Diniz do
        Nascimento, Ana Julia Pepe, Isabella Esteves e Sarah Cristina Campos Fonseca, reunindo funcionalidades voltadas
        ao controle de receitas e despesas, planejamento financeiro, acompanhamento da evolução dos gastos e acesso a
        conteúdos de educação financeira.
      </p>
      <p>
        O desenvolvimento técnico do SAVi foi realizado por Wesley Beluca, responsável por transformar a proposta
        idealizada pela equipe em uma aplicação funcional.
      </p>
      <p>
        Mais do que um aplicativo de controle financeiro, o SAVi foi pensado para ser uma ferramenta simples, acessível
        e intuitiva, capaz de ajudar o usuário a compreender melhor sua relação com o dinheiro, desenvolver hábitos
        financeiros mais conscientes e organizar seus objetivos de forma prática.
      </p>
    </div>

    <ul class="flex flex-col divide-y rounded-xl border text-sm">
      <li v-for="credito in creditos" :key="credito.rotulo" class="flex items-start gap-3 px-3 py-3">
        <component :is="credito.icone" class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div class="flex-1">
          <p class="font-medium">{{ credito.rotulo }}</p>
          <p class="text-muted-foreground">{{ credito.nomes }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
