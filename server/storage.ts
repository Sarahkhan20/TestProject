import { 
  users, 
  tenants, 
  fleets, 
  routers, 
  hotspotUsers, 
  firewallTemplates, 
  auditTrails,
  type User, 
  type InsertUser,
  type Tenant,
  type InsertTenant,
  type Fleet,
  type InsertFleet,
  type Router,
  type InsertRouter,
  type HotspotUser,
  type InsertHotspotUser,
  type FirewallTemplate,
  type InsertFirewallTemplate,
  type AuditTrail,
  type InsertAuditTrail
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql as sqlQuery } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Tenant methods
  getTenant(id: number): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  getAllTenants(): Promise<Tenant[]>;
  getTopTenants(limit: number): Promise<Tenant[]>;
  getTotalTenants(): Promise<number>;

  // Fleet methods
  getFleet(id: number): Promise<Fleet | undefined>;
  createFleet(fleet: InsertFleet): Promise<Fleet>;
  getAllFleets(): Promise<Fleet[]>;
  getTotalFleets(): Promise<number>;

  // Router methods
  getRouter(id: number): Promise<Router | undefined>;
  createRouter(router: InsertRouter): Promise<Router>;
  getAllRouters(): Promise<Router[]>;
  getOnlineRouters(): Promise<{ online: number, total: number }>;

  // Hotspot User methods
  getHotspotUser(id: number): Promise<HotspotUser | undefined>;
  createHotspotUser(hotspotUser: InsertHotspotUser): Promise<HotspotUser>;
  getAllHotspotUsers(): Promise<HotspotUser[]>;
  getHotspotUserStats(): Promise<{ active: number, total: number }>;

  // Firewall Template methods
  getFirewallTemplate(id: number): Promise<FirewallTemplate | undefined>;
  createFirewallTemplate(firewallTemplate: InsertFirewallTemplate): Promise<FirewallTemplate>;
  getAllFirewallTemplates(): Promise<FirewallTemplate[]>;

  // Audit Trail methods
  getAuditTrail(id: number): Promise<AuditTrail | undefined>;
  createAuditTrail(auditTrail: InsertAuditTrail): Promise<AuditTrail>;
  getAllAuditTrails(): Promise<AuditTrail[]>;
  filterAuditTrails(filters: {
    category?: string,
    event?: string,
    performedBy?: string,
    startDate?: Date,
    endDate?: Date
  }): Promise<AuditTrail[]>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    totalDataExchanged: number,
    hotspotUsers: { active: number, total: number },
    onlineRouters: { online: number, total: number },
    totalTenants: number,
    totalFleets: number
  }>;

  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Tenant methods
  async getTenant(id: number): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant || undefined;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db
      .insert(tenants)
      .values(tenant)
      .returning();
    return newTenant;
  }

  async getAllTenants(): Promise<Tenant[]> {
    return await db.select().from(tenants);
  }

  async getTopTenants(limit: number): Promise<Tenant[]> {
    return await db
      .select()
      .from(tenants)
      .orderBy(desc(tenants.dataUsage))
      .limit(limit);
  }

  async getTotalTenants(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(tenants);
    return result?.count || 0;
  }

  // Fleet methods
  async getFleet(id: number): Promise<Fleet | undefined> {
    const [fleet] = await db.select().from(fleets).where(eq(fleets.id, id));
    return fleet || undefined;
  }

  async createFleet(fleet: InsertFleet): Promise<Fleet> {
    const [newFleet] = await db
      .insert(fleets)
      .values(fleet)
      .returning();
    return newFleet;
  }

  async getAllFleets(): Promise<Fleet[]> {
    return await db.select().from(fleets);
  }

  async getTotalFleets(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(fleets);
    return result?.count || 0;
  }

  // Router methods
  async getRouter(id: number): Promise<Router | undefined> {
    const [router] = await db.select().from(routers).where(eq(routers.id, id));
    return router || undefined;
  }

  async createRouter(router: InsertRouter): Promise<Router> {
    const [newRouter] = await db
      .insert(routers)
      .values(router)
      .returning();
    return newRouter;
  }

  async getAllRouters(): Promise<Router[]> {
    return await db.select().from(routers);
  }

  async getOnlineRouters(): Promise<{ online: number, total: number }> {
    const allRouters = await db.select().from(routers);
    const onlineRouters = allRouters.filter(router => router.online);
    return {
      online: onlineRouters.length,
      total: allRouters.length
    };
  }

  // Hotspot User methods
  async getHotspotUser(id: number): Promise<HotspotUser | undefined> {
    const [hotspotUser] = await db
      .select()
      .from(hotspotUsers)
      .where(eq(hotspotUsers.id, id));
    return hotspotUser || undefined;
  }

  async createHotspotUser(hotspotUser: InsertHotspotUser): Promise<HotspotUser> {
    const [newHotspotUser] = await db
      .insert(hotspotUsers)
      .values(hotspotUser)
      .returning();
    return newHotspotUser;
  }

  async getAllHotspotUsers(): Promise<HotspotUser[]> {
    return await db.select().from(hotspotUsers);
  }

  async getHotspotUserStats(): Promise<{ active: number, total: number }> {
    const allUsers = await db.select().from(hotspotUsers);
    const activeUsers = allUsers.filter(user => user.active);
    return {
      active: activeUsers.length,
      total: allUsers.length
    };
  }

  // Firewall Template methods
  async getFirewallTemplate(id: number): Promise<FirewallTemplate | undefined> {
    const [firewallTemplate] = await db
      .select()
      .from(firewallTemplates)
      .where(eq(firewallTemplates.id, id));
    return firewallTemplate || undefined;
  }

  async createFirewallTemplate(firewallTemplate: InsertFirewallTemplate): Promise<FirewallTemplate> {
    const [newFirewallTemplate] = await db
      .insert(firewallTemplates)
      .values(firewallTemplate)
      .returning();
    return newFirewallTemplate;
  }

  async getAllFirewallTemplates(): Promise<FirewallTemplate[]> {
    return await db.select().from(firewallTemplates);
  }

  // Audit Trail methods
  async getAuditTrail(id: number): Promise<AuditTrail | undefined> {
    const [auditTrail] = await db
      .select()
      .from(auditTrails)
      .where(eq(auditTrails.id, id));
    return auditTrail || undefined;
  }

  async createAuditTrail(auditTrail: InsertAuditTrail): Promise<AuditTrail> {
    const [newAuditTrail] = await db
      .insert(auditTrails)
      .values(auditTrail)
      .returning();
    return newAuditTrail;
  }

  async getAllAuditTrails(): Promise<AuditTrail[]> {
    return await db
      .select()
      .from(auditTrails)
      .orderBy(desc(auditTrails.timestamp));
  }

  async filterAuditTrails(filters: {
    category?: string,
    event?: string,
    performedBy?: string,
    startDate?: Date,
    endDate?: Date
  }): Promise<AuditTrail[]> {
    let query = db
      .select()
      .from(auditTrails);

    if (filters.category) {
      query = query.where(eq(auditTrails.category, filters.category));
    }
    if (filters.event) {
      query = query.where(eq(auditTrails.event, filters.event));
    }
    if (filters.performedBy) {
      query = query.where(eq(auditTrails.performedBy, filters.performedBy));
    }
    // Add date filtering logic if needed

    const results = await query.orderBy(desc(auditTrails.timestamp));
    return results;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalDataExchanged: number,
    hotspotUsers: { active: number, total: number },
    onlineRouters: { online: number, total: number },
    totalTenants: number,
    totalFleets: number
  }> {
    const hotspotUsers = await this.getHotspotUserStats();
    const onlineRouters = await this.getOnlineRouters();
    const totalTenants = await this.getTotalTenants();
    const totalFleets = await this.getTotalFleets();

    // For totalDataExchanged, this would typically come from summing tenant data usage
    const tenants = await this.getAllTenants();
    const totalDataExchanged = tenants.reduce((sum, tenant) => sum + tenant.dataUsage, 0);

    return {
      totalDataExchanged,
      hotspotUsers,
      onlineRouters,
      totalTenants,
      totalFleets
    };
  }
}

export const storage = new DatabaseStorage();
