import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dataUsage: integer("data_usage").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fleets = pgTable("fleets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const routers = pgTable("routers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  identifier: text("identifier").notNull(),
  online: boolean("online").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hotspotUsers = pgTable("hotspot_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  active: boolean("active").default(true),
  routerId: integer("router_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const firewallTemplates = pgTable("firewall_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditTrails = pgTable("audit_trails", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  event: text("event").notNull(), // create, delete, update, download
  category: text("category").notNull(), // admin, firewall_rule, router_certificate, hotspot_user
  performedBy: text("performed_by").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const insertTenantSchema = createInsertSchema(tenants).pick({
  name: true,
  dataUsage: true,
});

export const insertFleetSchema = createInsertSchema(fleets).pick({
  name: true,
});

export const insertRouterSchema = createInsertSchema(routers).pick({
  name: true,
  identifier: true,
  online: true,
});

export const insertHotspotUserSchema = createInsertSchema(hotspotUsers).pick({
  username: true,
  active: true,
  routerId: true,
});

export const insertFirewallTemplateSchema = createInsertSchema(firewallTemplates).pick({
  name: true,
});

export const insertAuditTrailSchema = createInsertSchema(auditTrails).pick({
  description: true,
  event: true,
  category: true,
  performedBy: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;

export type InsertFleet = z.infer<typeof insertFleetSchema>;
export type Fleet = typeof fleets.$inferSelect;

export type InsertRouter = z.infer<typeof insertRouterSchema>;
export type Router = typeof routers.$inferSelect;

export type InsertHotspotUser = z.infer<typeof insertHotspotUserSchema>;
export type HotspotUser = typeof hotspotUsers.$inferSelect;

export type InsertFirewallTemplate = z.infer<typeof insertFirewallTemplateSchema>;
export type FirewallTemplate = typeof firewallTemplates.$inferSelect;

export type InsertAuditTrail = z.infer<typeof insertAuditTrailSchema>;
export type AuditTrail = typeof auditTrails.$inferSelect;

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;
