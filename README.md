# Damaso Barber - Sistema de Gestão para Barbearia

## 📋 Sobre o Projeto

O **Damaso Barber** é um sistema web completo desenvolvido para gestão de barbearias, oferecendo funcionalidades essenciais para o gerenciamento eficiente de clientes, serviços e agendamentos. O projeto foi desenvolvido como parte do Projeto Integrador de Programação WEB do curso de Análise e Desenvolvimento de Sistemas da Universidade Santo Amaro (UNISA).

## 🎯 Funcionalidades

**Autenticação de Usuários**: Sistema seguro de login e registro com JWT
**Gestão de Clientes**: Cadastro, edição, visualização e exclusão de clientes
**Catálogo de Serviços**: Gerenciamento completo dos serviços oferecidos
**Sistema de Agendamentos**: Controle de horários, status e histórico de atendimentos
**Dashboard Administrativo**: Visão consolidada das operações do estabelecimento
**Interface Responsiva**: Design adaptável para diferentes dispositivos

## 🚀 Tecnologias Utilizadas

### Frontend

**React 19.0.0**: Biblioteca para construção de interfaces de usuário
**TypeScript 5.6.3**: Superset tipado do JavaScript
**Vite 7.1.7**: Build tool moderna e rápida
**Wouter 3.3.5**: Roteamento leve para React
**Radix UI**: Componentes acessíveis e customizáveis
**Tailwind CSS 4.1.14**: Framework CSS utility-first
**Axios**: Cliente HTTP para requisições
**React Hook Form 7.64.0**: Gerenciamento de formulários
**Zod 4.1.12**: Validação de schemas

### Backend

**Node.js**: Ambiente de execução JavaScript
**Express 4.18.2**: Framework web para Node.js
**Prisma 5.22.0**: ORM moderno para Node.js
**MySQL**: Sistema gerenciador de banco de dados
**JSON Web Token 9.0.0**: Autenticação via JWT
**Bcrypt 5.1.0**: Criptografia de senhas
**CORS 2.8.5**: Middleware para Cross-Origin Resource Sharing
**Dotenv 16.0.0**: Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```bash
damasoBarber/
├── backend/                    # Código do servidor
│   ├── prisma/                # Schema e migrações do banco de dados
│   │   ├── migrations/        # Migrações do banco
│   │   └── schema.prisma      # Definição do schema
│   ├── src/
│   │   ├── controllers/       # Controladores das rotas
│   │   ├── database/          # Configuração do Prisma Client
│   │   ├── middlewares/       # Middlewares (auth, error, logger)
│   │   ├── routes/            # Definição das rotas da API
│   │   ├── services/          # Lógica de negócio
│   │   ├── utils/             # Utilitários (JWT, validators)
│   │   ├── seed.js            # Script de seed do banco
│   │   └── server.js          # Arquivo principal do servidor
│   ├── .env                   # Variáveis de ambiente
│   └── package.json           # Dependências do backend
├── frontend/                  # Código do cliente
│   ├── client/
│   │   ├── src/
│   │   │   ├── components/    # Componentes React
│   │   │   │   ├── layout/    # Componentes de layout
│   │   │   │   └── ui/        # Componentes de UI
│   │   │   ├── contexts/      # Contextos React (Auth, Theme)
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── lib/           # Bibliotecas e utilitários
│   │   │   ├── pages/         # Páginas da aplicação
│   │   │   │   ├── Bookings/  # Gestão de agendamentos
│   │   │   │   ├── Clients/   # Gestão de clientes
│   │   │   │   └── Services/  # Gestão de serviços
│   │   │   ├── App.tsx        # Componente principal
│   │   │   └── main.tsx       # Ponto de entrada
│   │   ├── index.html         # HTML principal
│   │   └── public/            # Arquivos estáticos
│   ├── package.json           # Dependências do frontend
│   └── vite.config.ts         # Configuração do Vite
├── docs/                      # Documentação do projeto
└── README.md                  # Este arquivo
```

## 🔧 Instalação e Configuração

### Pré-requisitos

Node.js (versão 18 ou superior)
MySQL (versão 8 ou superior)
npm ou pnpm

### Passo 1: Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd damasoBarber
```

### Passo 2: Configurar o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/damosobarber_db"
PORT=4000
JWT_SECRET=sua_chave_secreta_aqui
```

Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

(Opcional) Execute o seed para popular o banco com dados iniciais:

```bash
npm run seed
```

### Passo 3: Configurar o Frontend

```bash
cd ../frontend
pnpm install
```

### Passo 4: Executar a Aplicação

**Backend** (em um terminal):

```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:4000`

**Frontend** (em outro terminal):

```bash
cd frontend
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🗄️ Modelo de Dados

### User (Usuário)

id`: UUID (chave primária)
email`: String (único)
name`: String (opcional)
password`: String (criptografado)
role`: String (padrão: "user")
createdAt`: DateTime

### Client (Cliente)

`id`: UUID (chave primária)
`name`: String
`phone`: String
`email`: String (opcional)
`notes`: String (opcional)
`bookings`: Relação com Booking[]
`createdAt`: DateTime

### Service (Serviço)

`id`: UUID (chave primária)
`name`: String
`price`: Float
`durationMinutes`: Int (opcional)
`createdAt`: DateTime

### Booking (Agendamento)

`id`: UUID (chave primária)
`clientId`: String (chave estrangeira)
`client`: Relação com Client
`start`: DateTime
`end`: DateTime
`service`: String
`status`: String (scheduled | cancelled | done)
`createdAt`: DateTime

## 🔐 Autenticação

O sistema utiliza **JSON Web Tokens (JWT)** para autenticação. O fluxo de autenticação funciona da seguinte forma:

1.O usuário faz login com email e senha
2.O backend valida as credenciais e gera um token JWT
3.O token é armazenado no cliente (localStorage)
4.Requisições subsequentes incluem o token no header `Authorization`
5.Middlewares no backend validam o token antes de processar requisições protegidas

As senhas são criptografadas usando **bcrypt** antes de serem armazenadas no banco de dados.

## 📡 API Endpoints

### Autenticação

`POST /api/auth/register` - Registrar novo usuário
`POST /api/auth/login` - Fazer login

### Clientes

`GET /api/clients` - Listar todos os clientes
`GET /api/clients/:id` - Obter detalhes de um cliente
`POST /api/clients` - Criar novo cliente
`PUT /api/clients/:id` - Atualizar cliente
`DELETE /api/clients/:id` - Deletar cliente

### Serviços

`GET /api/services` - Listar todos os serviços
`GET /api/services/:id` - Obter detalhes de um serviço
`POST /api/services` - Criar novo serviço
`PUT /api/services/:id` - Atualizar serviço
`DELETE /api/services/:id` - Deletar serviço

### Agendamentos

`GET /api/bookings` - Listar todos os agendamentos
`GET /api/bookings/:id` - Obter detalhes de um agendamento
`POST /api/bookings` - Criar novo agendamento
`PUT /api/bookings/:id` - Atualizar agendamento
`DELETE /api/bookings/:id` - Deletar agendamento

### Health Check

`GET /api/health` - Verificar status da API

## 🧪 Scripts Disponíveis

### Scripts do Backend

```bash
npm run dev          # Inicia o servidor em modo desenvolvimento
npm start            # Inicia o servidor em modo produção
npm run prisma:generate  # Gera o Prisma Client
npm run prisma:migrate   # Executa migrações do banco
npm run seed         # Popula o banco com dados iniciais
```

### Scripts do Frontend

```bash
pnpm dev            # Inicia o servidor de desenvolvimento
pnpm build          # Cria build de produção
pnpm preview        # Preview do build de produção
pnpm check          # Verifica tipos TypeScript
pnpm format         # Formata código com Prettier
```

## 👥 Autor

Projeto desenvolvido como Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas da Universidade Santo Amaro (UNISA).

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

## 📚 Documentação Adicional

Para mais informações sobre o projeto, consulte:

[Artigo Científico Completo](./docs/Artigo_Projeto_Integrador_DamasoBarber.md)
[Documentação do Prisma](https://www.prisma.io/docs)
[Documentação do React](https://react.dev/)
[Documentação do Node.js](https://nodejs.org/)

## 🤝 Contribuições

Este é um projeto acadêmico, mas sugestões e melhorias são bem-vindas!

---

Desenvolvido com ❤️ para o Projeto Integrador - Programação WEB
