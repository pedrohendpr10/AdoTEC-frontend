# AdoTEC — Frontend

Interface web do **AdoTEC** (Sistema de Adoção do Centro de Zoonoses).
Consome a API REST do backend Spring Boot.

## Tecnologias

- **React 18** + **Vite** — build moderno e rápido
- **React Router 6** — navegação
- **Axios** — cliente HTTP
- **CSS puro com design tokens** — paleta e estilos centralizados

## Pré-requisitos

- **Node.js 18+**
- O **backend do AdoTEC** rodando (por padrão em `http://localhost:8080`)

## Como rodar

```bash
# 1. Instalar as dependências
npm install

# 2. Configurar o ambiente (opcional — o padrão já aponta para localhost:8080)
copy .env.example .env        # Windows
# cp .env.example .env        # Linux/macOS

# 3. Iniciar em modo desenvolvimento
npm run dev
```

O site abre em **http://localhost:5173** — esta porta já está liberada no
CORS do backend; mantenha-a.

### Outros comandos

```bash
npm run build     # gera a versão de produção em dist/
npm run preview   # pré-visualiza o build de produção
```

## Configuração

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API do backend | `http://localhost:8080` |

## Estrutura de pastas

```
src/
├── api/          → camada de comunicação com o backend (1 arquivo por recurso)
│   ├── client.js       → instância Axios + injeção do JWT + tratamento de 401
│   ├── errors.js       → normalização e tradução de erros
│   ├── authApi.js, petsApi.js, appointmentsApi.js, timeslotsApi.js
├── context/      → estado global
│   ├── AuthContext.jsx → usuário logado, login/logout, roles
│   └── ToastContext.jsx→ notificações
├── hooks/        → hooks reutilizáveis (paginação, debounce)
├── components/
│   ├── ui/       → componentes genéricos (Button, Input, Modal, Badge...)
│   ├── layout/   → Navbar, Footer, Layout
│   ├── routing/  → ProtectedRoute
│   └── pets/     → PetCard, PetFilters, Pagination, ScheduleModal
├── pages/        → uma pasta = uma tela (Home, Catálogo, Detalhe, Login...)
├── styles/
│   ├── tokens.css→ ⭐ PALETA E TOKENS — altere as cores aqui
│   └── global.css→ estilos da aplicação
├── utils/        → formatação de datas, enums, etc.
├── App.jsx       → mapa de rotas
└── main.jsx      → ponto de entrada
```

## Identidade visual

Toda a paleta está em **`src/styles/tokens.css`**. Para mudar uma cor do site
inteiro, altere apenas esse arquivo.

| Token | Cor | Uso |
|---|---|---|
| `--color-primary-dark` | `#006A52` Verde Petróleo | Navbar, footer, títulos |
| `--color-primary` | `#00A859` Verde Bandeira | Botões, cards, banners |
| `--color-accent` | `#FFD200` Amarelo Ouro | Alertas, ícones, hover |
| `--color-bg` | `#F8F9FA` Branco Gelo | Fundo das páginas |

## Telas implementadas

| Rota | Tela | Acesso |
|---|---|---|
| `/` | Início (hero, como funciona, prévia de pets) | Público |
| `/pets` | Catálogo com busca e filtro de porte | Público |
| `/pets/:id` | Detalhe do pet + galeria + agendar visita | Público |
| `/login` | Login (com tratamento de rate limit 429) | Público |
| `/cadastro` | Cadastro de adotante | Público |
| `/meus-agendamentos` | Lista de agendamentos + cancelamento | Requer login |

## Próximas fases (ainda não implementadas)

- **Painel administrativo** (ADMIN/EMPLOYEE): cadastro/edição de pets,
  upload de fotos (Cloudinary), gestão de horários, atribuição de
  funcionários e registro de resultado das visitas.
- Refresh token (o backend ainda não expõe — a sessão expira sem aviso).

## Notas de integração com a API

- **Autenticação:** JWT enviado no header `Authorization: Bearer <token>`.
  Guardado em `sessionStorage`; as *roles* vêm da resposta do login.
- **Filtro de porte no catálogo:** aplicado no cliente — o parâmetro `size`
  da API colide com o `size` da paginação do Spring (ver `api/petsApi.js`).
- **Rate limit:** o login é limitado a 5 tentativas/60s por IP; a tela de
  login trata o `429` desabilitando o botão temporariamente.
