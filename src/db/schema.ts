import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  boolean,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['super_admin', 'client']);

// ── Clients ──────────────────────────────────────────────────────────────────

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const clientsRelations = relations(clients, ({ many }) => ({
  users: many(users),
  clientDashboards: many(clientDashboards),
  clientGraphs: many(clientGraphs),
}));

// ── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('client'),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  client: one(clients, {
    fields: [users.clientId],
    references: [clients.id],
  }),
}));

// ── Dashboards ───────────────────────────────────────────────────────────────

export const dashboards = pgTable('dashboards', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
});

export const dashboardsRelations = relations(dashboards, ({ many }) => ({
  graphs: many(graphs),
  clientDashboards: many(clientDashboards),
}));

// ── Graphs ───────────────────────────────────────────────────────────────────

export const graphs = pgTable(
  'graphs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: varchar('key', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    dashboardKey: varchar('dashboard_key', { length: 255 })
      .notNull()
      .references(() => dashboards.key, { onDelete: 'cascade' }),
    component: varchar('component', { length: 255 }).notNull(),
  },
  (table) => [uniqueIndex('graphs_key_dashboard_key_idx').on(table.key, table.dashboardKey)],
);

export const graphsRelations = relations(graphs, ({ one, many }) => ({
  dashboard: one(dashboards, {
    fields: [graphs.dashboardKey],
    references: [dashboards.key],
  }),
  clientGraphs: many(clientGraphs),
}));

// ── Client ↔ Dashboard (many-to-many) ────────────────────────────────────────

export const clientDashboards = pgTable(
  'client_dashboards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id, { onDelete: 'cascade' }),
    dashboardId: uuid('dashboard_id')
      .notNull()
      .references(() => dashboards.id, { onDelete: 'cascade' }),
    enabled: boolean('enabled').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => [uniqueIndex('client_dashboards_unique_idx').on(table.clientId, table.dashboardId)],
);

export const clientDashboardsRelations = relations(clientDashboards, ({ one }) => ({
  client: one(clients, {
    fields: [clientDashboards.clientId],
    references: [clients.id],
  }),
  dashboard: one(dashboards, {
    fields: [clientDashboards.dashboardId],
    references: [dashboards.id],
  }),
}));

// ── Client ↔ Graph (many-to-many) ────────────────────────────────────────────

export const clientGraphs = pgTable(
  'client_graphs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id, { onDelete: 'cascade' }),
    graphId: uuid('graph_id')
      .notNull()
      .references(() => graphs.id, { onDelete: 'cascade' }),
    enabled: boolean('enabled').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => [uniqueIndex('client_graphs_unique_idx').on(table.clientId, table.graphId)],
);

export const clientGraphsRelations = relations(clientGraphs, ({ one }) => ({
  client: one(clients, {
    fields: [clientGraphs.clientId],
    references: [clients.id],
  }),
  graph: one(graphs, {
    fields: [clientGraphs.graphId],
    references: [graphs.id],
  }),
}));
