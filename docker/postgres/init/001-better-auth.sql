create schema if not exists public;

create table "user" (
  "id" text primary key not null,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null default false,
  "image" text,
  "createdAt" timestamptz not null default CURRENT_TIMESTAMP,
  "updatedAt" timestamptz not null default CURRENT_TIMESTAMP,
  "username" text unique,
  "displayUsername" text
);

create table "session" (
  "id" text primary key not null,
  "expiresAt" timestamptz not null,
  "token" text not null unique,
  "createdAt" timestamptz not null default CURRENT_TIMESTAMP,
  "updatedAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references "user"("id") on delete cascade
);

create table "account" (
  "id" text primary key not null,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references "user"("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz not null default CURRENT_TIMESTAMP,
  "updatedAt" timestamptz not null
);

create table "verification" (
  "id" text primary key not null,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default CURRENT_TIMESTAMP,
  "updatedAt" timestamptz not null default CURRENT_TIMESTAMP
);

create table "ssoProvider" (
  "id" text primary key not null,
  "issuer" text not null,
  "oidcConfig" text,
  "samlConfig" text,
  "userId" text not null references "user"("id") on delete cascade,
  "providerId" text not null unique,
  "organizationId" text,
  "domain" text not null
);

create index "session_userId_idx" on "session" ("userId");

create index "account_userId_idx" on "account" ("userId");

create index "verification_identifier_idx" on "verification" ("identifier");
