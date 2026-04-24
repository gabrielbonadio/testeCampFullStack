# Teste Camp FullStack API (Grupo Cred)

API REST desenvolvida para um teste técnico de **Desenvolvedor Full Stack**. Inclui autenticação via **JWT**, estrutura modular por domínios e documentação via **Swagger**.

## Tech Stack

![Node.js]
![TypeScript]
![Express]
![Prisma]
![SQLite]
![Jest]
![Swagger]

## Arquitetura

O projeto segue uma arquitetura **estritamente modular por domínio**, concentrada em `src/modules/`:

- **Auth** (`src/modules/auth`): login e emissão de JWT
- **Users** (`src/modules/users`): cadastro, atualização, listagem e exclusão lógica
- **Orders** (`src/modules/orders`): criação e consultas de pedidos

Rotas e middlewares:

- **Rotas centralizadas** em `src/routes.ts`
- **Middleware JWT** em `src/middlewares/auth.middleware.ts`

## Getting Started

### Requisitos

- Node.js (Desenvolvido e testado na versão **v24.14.1**)
- npm

### Instalação

```bash
npm install
```

### Banco de dados (SQLite)

O banco é SQLite e é configurado via `.env`:

- `DATABASE_URL="file:./dev.db"`

Aplicar o schema (criar/atualizar tabelas):

```bash
npx prisma db push
```

### Rodar a API

```bash
npm run dev
```

Endpoint de saúde:

- `GET /health`

## Documentação (Swagger) e Autenticação

Com a API rodando, acesse a documentação:

- `http://localhost:3000/docs`

Rotas protegidas exigem JWT (Bearer Token):

- Faça **POST `/login`**
- Copie o `token` retornado
- No Swagger, clique em **Authorize** e informe:
  - `Bearer <seu_token>`

## Rotas principais

- **Auth**
  - `POST /login`
- **Users**
  - `POST /users`
  - `GET /users` (protegido)
  - `PUT /users/:id` (protegido)
  - `DELETE /users/:id` (protegido, exclusão lógica via `deletedAt`)
- **Orders**
  - `POST /orders` (protegido)
  - `GET /orders` (protegido)
  - `GET /orders/user/:userId` (protegido)

## Testes

A suíte de testes usa **Jest + Supertest** e **mocks do Prisma** (via `jest-mock-extended`), evitando dependência de SQLite durante os testes.

Rodar a suíte:

```bash
npm run test
```

Cobertura:

```bash
npm run test:coverage
```

