import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { getAuthTables } from '@better-auth/core/db';

import { buildAuthConfig } from '../src/auth/auth.config';

type AuthField = {
  type: string | string[];
  required?: boolean;
  unique?: boolean;
  index?: boolean;
  defaultValue?: unknown;
  references?: {
    model: string;
    field: string;
    onDelete?: string;
  };
};

type AuthTable = {
  fields: Record<string, AuthField>;
  order?: number;
};

function quoteIdentifier(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function sqlTypeFor(fieldName: string, field: AuthField): string {
  if (fieldName === 'id' || field.references?.field === 'id') {
    return 'text';
  }

  if (Array.isArray(field.type)) {
    return 'text';
  }

  switch (field.type) {
    case 'string':
      return 'text';
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'integer';
    case 'date':
      return 'timestamptz';
    case 'json':
      return 'jsonb';
    case 'string[]':
    case 'number[]':
      return 'jsonb';
    default:
      throw new Error(`Unsupported field type: ${String(field.type)}`);
  }
}

function columnSql(fieldName: string, field: AuthField): string {
  const pieces = [quoteIdentifier(fieldName), sqlTypeFor(fieldName, field)];

  if (field.required !== false) {
    pieces.push('not null');
  }

  if (field.references) {
    pieces.push(
      `references ${quoteIdentifier(field.references.model)}(${quoteIdentifier(field.references.field)})`,
      `on delete ${field.references.onDelete ?? 'cascade'}`
    );
  }

  if (field.unique) {
    pieces.push('unique');
  }

  if (field.type === 'boolean' && field.defaultValue !== undefined) {
    pieces.push(`default ${field.defaultValue ? 'true' : 'false'}`);
  }

  if (field.type === 'date' && typeof field.defaultValue === 'function') {
    pieces.push('default CURRENT_TIMESTAMP');
  }

  return pieces.join(' ');
}

function generateSchemaSql(tables: Record<string, AuthTable>): string {
  const orderedTables = Object.entries(tables).sort((left, right) => (left[1].order ?? Infinity) - (right[1].order ?? Infinity));
  const statements: string[] = ['create schema if not exists public;'];
  const deferredIndexes: string[] = [];

  for (const [tableName, table] of orderedTables) {
    const columnDefinitions = ['"id" text primary key not null'];

    for (const [fieldName, field] of Object.entries(table.fields)) {
      columnDefinitions.push(columnSql(fieldName, field));

      if (field.index) {
        const indexName = `${tableName}_${fieldName}_${field.unique ? 'uidx' : 'idx'}`;
        const unique = field.unique ? 'unique ' : '';
        deferredIndexes.push(
          `create ${unique}index ${quoteIdentifier(indexName)} on ${quoteIdentifier(tableName)} (${quoteIdentifier(fieldName)});`
        );
      }
    }

    statements.push(`create table ${quoteIdentifier(tableName)} (\n  ${columnDefinitions.join(',\n  ')}\n);`);
  }

  statements.push(...deferredIndexes);
  return `${statements.join('\n\n')}\n`;
}

async function main(): Promise<void> {
  const outputPath = resolve(process.cwd(), 'docker/postgres/init/001-better-auth.sql');
  const tables = getAuthTables(buildAuthConfig(process.env)) as Record<string, AuthTable>;
  const sql = generateSchemaSql(tables);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, sql);
}

void main();
