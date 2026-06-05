<div align="center">

# 🐾 AdoTEC — Frontend

[![Version](https://img.shields.io/badge/version-0.2.0-blue?style=for-the-badge)](https://github.com/JoaoRobrt/AdoTEC-frontend)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vite.dev/)

Interface web do **AdoTEC** (Sistema de Adoção do Centro de Zoonoses).  
Consome a API REST do backend Spring Boot.

</div>

---

## Tecnologias

- **React 18** + **Vite 5** — build moderno e rápido
- **React Router 6** — navegação com rotas protegidas por role
- **Axios** — cliente HTTP com interceptores para JWT e tratamento de erros
- **CSS puro com design tokens** — paleta e estilos centralizados (sem frameworks CSS)

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
│   ├── client.js           → instância Axios + injeção do JWT + tratamento de 401
│   ├── errors.js           → normalização e tradução de erros
│   ├── authApi.js           → login, registro, /me
│   ├── petsApi.js           → CRUD de pets + filtros avançados
│   ├── photosApi.js         → upload/exclusão de fotos (Cloudinary)
│   ├── appointmentsApi.js   → agendamentos + dashboard
│   ├── employeesApi.js      → CRUD de funcionários (ADMIN)
│   └── timeslotsApi.js      → consulta de horários disponíveis
├── context/      → estado global
│   ├── AuthContext.jsx      → usuário logado, login/logout, roles (isAdmin)
│   └── ToastContext.jsx     → notificações toast
├── hooks/        → hooks reutilizáveis (paginação, debounce)
├── components/
│   ├── ui/       → componentes genéricos (Button, Input, Modal, Badge, Spinner...)
│   ├── layout/   → Navbar, Footer, Layout
│   ├── routing/  → ProtectedRoute (guarda por role)
│   ├── pets/     → PetCard, CatalogSidebar, SortSelect, Pagination, ScheduleModal
│   └── admin/    → AdminLayout, AdminSidebar, PetForm, PhotoUploader,
│                   AssignEmployeeModal, RegisterResultModal, StatCard,
│                   EmployeeFormModal
├── pages/        → telas do site público e do painel administrativo
│   ├── HomePage, CatalogPage, PetDetailPage
│   ├── LoginPage, RegisterPage, MyAppointmentsPage
│   └── admin/    → DashboardPage, PetsAdminPage, PetFormPage, PetPhotosPage,
│                   AppointmentsAdminPage, AppointmentDetailPage, EmployeesPage
├── styles/
│   ├── tokens.css→ ⭐ PALETA E TOKENS — altere as cores aqui
│   └── global.css→ estilos da aplicação
├── utils/        → formatação de datas, enums, labels PT-BR
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

### Site público

| Rota | Tela | Acesso |
|---|---|---|
| `/` | Início (hero, como funciona, prévia de pets em destaque) | Público |
| `/pets` | Catálogo com filtros avançados (sidebar), ordenação e paginação via URL | Público |
| `/pets/:id` | Detalhe do pet + galeria + informações (porte, sexo, idade) + agendar visita | Público |
| `/login` | Login (com tratamento de rate limit 429) | Público |
| `/cadastro` | Cadastro de adotante | Público |
| `/meus-agendamentos` | Lista de agendamentos do adotante + cancelamento | Requer login |

### Painel administrativo (`/painel`)

| Rota | Tela | Acesso |
|---|---|---|
| `/painel` | Dashboard com métricas e lista de agendamentos não atribuídos | ADMIN / EMPLOYEE |
| `/painel/pets` | Listagem de todos os pets (CRUD) | ADMIN / EMPLOYEE |
| `/painel/pets/novo` | Formulário de cadastro de pet (com campo de sexo) | ADMIN / EMPLOYEE |
| `/painel/pets/:id/editar` | Formulário de edição de pet | ADMIN / EMPLOYEE |
| `/painel/pets/:id/fotos` | Gerenciamento de fotos do pet (upload Cloudinary) | ADMIN / EMPLOYEE |
| `/painel/agendamentos` | Listagem de agendamentos com filtros (status, funcionário, não atribuídos) | ADMIN / EMPLOYEE |
| `/painel/agendamentos/:id` | Detalhe do agendamento (atribuir funcionário, registrar resultado) | ADMIN / EMPLOYEE |
| `/painel/funcionarios` | CRUD de funcionários (criar, editar, ativar/desativar) | Apenas ADMIN |

## Funcionalidades do catálogo

O catálogo de pets (`/pets`) possui um sistema completo de filtros avançados:

- **Sidebar de filtros** com accordions para: Espécie, Porte, Sexo e Faixa de idade
- **Busca por nome** com debounce (400ms)
- **Ordenação** por: mais recentes, mais antigos, nome A-Z/Z-A, menor/maior idade
- **Paginação** com sincronização completa via URL (query params)
- **Responsividade**: em telas pequenas a sidebar se transforma em uma gaveta (drawer) de tela cheia
- Todos os filtros são persistidos na URL, permitindo compartilhamento de buscas

## Notas de integração com a API

- **Autenticação:** JWT enviado no header `Authorization: Bearer <token>`.
  Guardado em `sessionStorage`; as *roles* vêm da resposta do login.
- **Filtros do catálogo:** aplicados no servidor — o parâmetro `petSize` é
  enviado separadamente do `size` da paginação (resolvido na v0.2.0).
- **Rate limit:** o login é limitado a 5 tentativas/60s por IP; a tela de
  login trata o `429` desabilitando o botão temporariamente.
- **Cache:** os pets em destaque da home page são cacheados no Redis; a
  invalidação é automática ao criar/editar/excluir pets.

---

<div align="center">
  <sub>Desenvolvido como Projeto Integrador · AdoTEC · 2026</sub>
</div>
