# Nest Starter

`nest-starter` is a template repository for building APIs with [NestJS](https://nestjs.com/).

It is intended to be a practical starting point for new backend services, with the core pieces of a modern API project already wired together so you can begin building domain features instead of redoing setup work on every repository.

## What this template includes

- [NestJS](https://nestjs.com/) as the application framework
- [Better Auth](https://www.better-auth.com/) for authentication
- [Zod](https://zod.dev/) for request validation and transformation
- [Vitest](https://vitest.dev/) for testing
- [Kysely](https://kysely.dev/) with PostgreSQL for database access and migrations
- [Biome](https://biomejs.dev/) for linting and formatting
- [Bun](https://bun.sh/) as the package manager and script runner
- [SWC](https://swc.rs/) for fast builds in development

## Repository purpose

This repository is designed to be used as a template when starting a new API project.

It already demonstrates a sensible baseline for:

- authentication setup
- validation patterns
- database wiring
- migration execution
- test structure
- local development with PostgreSQL

The goal is to give new services a consistent foundation so teams can move directly into product and domain work.

## Current project structure

```text
src/
  app.module.ts
  main.ts
  auth/
  database/
  users/
  validation/
scripts/
  migrate-database.ts
docs/
  glossary.md
docker-compose.yml
```

Key areas:

- `src/auth` contains Better Auth configuration
- `src/database` contains the Kysely database client and migration utilities
- `src/validation` contains reusable validation helpers such as the Zod validation pipe
- `scripts/migrate-database.ts` runs database migrations
- `docker-compose.yml` provides a local PostgreSQL instance for development

## Prerequisites

Before running the project, make sure you have:

- [Bun](https://bun.sh/)
- Docker and Docker Compose
- A Google OAuth application if you want to use the included Google auth provider

## Environment variables

Create a `.env` file with the variables required by the current starter:

```bash
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/nest_starter
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=change-me
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Notes:

- `AUTH_SECRET` can be used instead of `BETTER_AUTH_SECRET`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are currently required by the auth configuration

## Getting started

Install dependencies:

```bash
bun install
```

Start PostgreSQL:

```bash
docker compose up -d
```

Run database migrations:

```bash
bun run db:migrate
```

Start the NestJS app in development mode:

```bash
bun run start:dev
```

The API will be available at `http://localhost:3000`.

## Available scripts

```bash
bun run build
bun run start
bun run start:dev
bun run start:debug
bun run start:prod
bun run test
bun run test:watch
bun run lint
bun run lint:fix
bun run db:migrate
```

## Included patterns

### Authentication

Authentication is configured with Better Auth through `@thallesp/nestjs-better-auth`.

The starter currently includes:

- email and password authentication
- Google social login
- SSO support
- username plugin support

Example authenticated routes are available in `src/users.controller.ts`.

### Validation

Request validation is handled with Zod.

The starter includes a reusable `ZodValidationPipe` so DTO validation can stay close to each route schema instead of relying on class-validator decorators.

### Database

Database access is built on PostgreSQL and Kysely.

The repository includes:

- a typed database client
- migration helpers
- an initial auth-related migration
- `pg-mem` for testing database-related code without a real Postgres instance in every test

## Testing

Tests are written with Vitest. The repository already includes example specs for app setup, auth configuration, and database migrations that can be used as patterns for new test coverage.

Run the full test suite with:

```bash
bun run test
```

## Using this repository as a template

When starting a new API project from this repository, you will usually want to:

1. Create a new repository from this template.
2. Rename or remove the sample controllers and example user endpoints.
3. Update authentication providers and secrets for your environment.
4. Add your project-specific database schema and migrations.
5. Add your domain modules, services, and tests.

## Documentation

- [docs/glossary.md](./docs/glossary.md) contains product vocabulary and shared domain terminology for AI coding.

## Development notes

- For database schema or migration work, follow the project guidance in `AGENTS.md`
