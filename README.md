# SAVi — Frontend

App de controle financeiro pessoal, entregue como **PWA** (foco em iOS/Android, também funciona no navegador do desktop).

A API fica em um repositório separado: [SAVI-Back](https://github.com/wesley-beluca/SAVI-Back).

## Stack

- **Vue 3** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + componentes **shadcn-vue** (reka-ui)
- **TanStack Query** para cache e sincronização com a API
- **Pinia** para estado da sessão
- **Vue Router** com rotas protegidas
- **ApexCharts** para gráficos
- **vite-plugin-pwa** para instalação como app

## Estrutura

```
api/          clientes HTTP da API (axios)
assets/       estilos globais e cores da marca
components/   componentes por domínio (auth, transactions, planejamento...) e ui/ (shadcn-vue)
layouts/      AppShell (área logada) e AuthLayout
middleware/   guarda de autenticação das rotas
mixins/       composables (queries/mutations do TanStack Query, validação de formulários)
pages/        telas: inicio, movimentacoes, evolucao, planejamento, categorias, perfil, auth
router/       definição das rotas
store/        stores Pinia
utils/        utilitários (formatação, ícones, insights)
```

## Rodando localmente

Pré-requisitos: **Node.js 22.18+** (ou 24.12+) e a [API](https://github.com/wesley-beluca/SAVI-Back) rodando.

```powershell
cp .env.example .env.local   # ajuste as variáveis se necessário
npm install
npm run dev
```

O app abre em `http://localhost:5173`.

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API. Em dev: `http://localhost:5285`. |
| `VITE_GOOGLE_CLIENT_ID` | Client ID OAuth do Google Cloud Console (necessário só para login com Google). |

Arquivos `*.local` são ignorados pelo git. Use `.env.local` para valores pessoais.

> Tudo que começa com `VITE_` vai embutido no JavaScript entregue ao navegador, então **nunca coloque segredos aqui**. O Client ID do Google é público por natureza.

### Login com Google (dev)

1. No [Google Cloud Console](https://console.cloud.google.com/), vá em APIs e serviços → Credenciais → "ID do cliente OAuth" (tipo "Aplicativo da Web").
2. Em "Origens JavaScript autorizadas", adicione `http://localhost:5173`.
3. Coloque o Client ID em `VITE_GOOGLE_CLIENT_ID` (aqui) e em `Google:ClientId` na API.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Type-check + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run type-check` | Verificação de tipos com `vue-tsc` |
| `npm run lint` | oxlint + ESLint (com `--fix`) |
| `npm run format` | Prettier |

## Publicação

Deploy no **Cloudflare Pages** pelo workflow [`.github/workflows/frontend.yml`](.github/workflows/frontend.yml): em todo push na `main`, ele roda lint, build e publica o `dist/`.

Configure em `Settings → Secrets and variables → Actions`:

- **Secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- **Variables:** `VITE_API_URL` (URL da API no Cloud Run), `VITE_GOOGLE_CLIENT_ID`
