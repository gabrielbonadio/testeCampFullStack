# Teste Camp FullStack API

API REST em **Node.js + Express + TypeScript**, com **Prisma ORM** e **SQLite**.

## Requisitos

- Node.js (recomendado 18+)
- npm

## Instalação

```bash
npm install
```

## Banco de dados (SQLite)

O SQLite é configurado via `.env`:

- `DATABASE_URL="file:./dev.db"`

Para aplicar o schema no banco (criar/atualizar as tabelas) use:

```bash
npx prisma db push
```

Opcional (migrações em dev):

```bash
npx prisma migrate dev
```

## Rodar a API

Desenvolvimento:

```bash
npm run dev
```

Build + produção:

```bash
npm run build
npm start
```

## Swagger

Com a API rodando, acesse:

- `http://localhost:3000/docs`

Para acessar rotas protegidas:

- clique em **Authorize**
- informe: `Bearer <seu_token_jwt>`

## Rotas

- Auth: `POST /login`
- Users: `POST /users`, `GET /users`, `PUT /users/:id`, `DELETE /users/:id`
- Orders: `POST /orders`, `GET /orders`, `GET /orders/user/:userId`

## Testes

Rodar a suíte:

```bash
npm run test
```

Rodar com cobertura:

```bash
npm run test:coverage
```

