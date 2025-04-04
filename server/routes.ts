import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes with /api prefix
  // Tenants
  app.get("/api/tenants", async (req, res) => {
    const tenants = await storage.getAllTenants();
    res.json(tenants);
  });

  app.get("/api/tenants/top", async (req, res) => {
    const limit = Number(req.query.limit) || 5;
    const tenants = await storage.getTopTenants(limit);
    res.json(tenants);
  });

  // Fleets
  app.get("/api/fleets", async (req, res) => {
    const fleets = await storage.getAllFleets();
    res.json(fleets);
  });

  // Routers
  app.get("/api/routers", async (req, res) => {
    const routers = await storage.getAllRouters();
    res.json(routers);
  });

  app.get("/api/routers/stats", async (req, res) => {
    const stats = await storage.getOnlineRouters();
    res.json(stats);
  });

  // Hotspot Users
  app.get("/api/hotspot-users", async (req, res) => {
    const hotspotUsers = await storage.getAllHotspotUsers();
    res.json(hotspotUsers);
  });

  app.get("/api/hotspot-users/stats", async (req, res) => {
    const stats = await storage.getHotspotUserStats();
    res.json(stats);
  });

  // Firewall Templates
  app.get("/api/firewall-templates", async (req, res) => {
    const firewallTemplates = await storage.getAllFirewallTemplates();
    res.json(firewallTemplates);
  });

  // Audit Trails
  app.get("/api/audit-trails", async (req, res) => {
    const auditTrails = await storage.getAllAuditTrails();
    res.json(auditTrails);
  });

  app.post("/api/audit-trails/filter", async (req, res) => {
    const filterSchema = z.object({
      category: z.string().optional(),
      event: z.string().optional(),
      performedBy: z.string().optional(),
      startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
      endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    });

    try {
      const filters = filterSchema.parse(req.body);
      const auditTrails = await storage.filterAuditTrails(filters);
      res.json(auditTrails);
    } catch (error) {
      res.status(400).json({ error: "Invalid filter parameters" });
    }
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Create routes - all require authentication
  app.post("/api/tenants", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const tenant = await storage.createTenant(req.body);
      
      // Create audit trail entry
      await storage.createAuditTrail({
        description: `Tenant ${tenant.name} was created`,
        event: "Create",
        category: "Tenant",
        performedBy: req.user.name,
      });
      
      res.status(201).json(tenant);
    } catch (error) {
      res.status(400).json({ error: "Invalid tenant data" });
    }
  });

  app.post("/api/fleets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const fleet = await storage.createFleet(req.body);
      
      await storage.createAuditTrail({
        description: `Fleet ${fleet.name} was created`,
        event: "Create",
        category: "Fleet",
        performedBy: req.user.name,
      });
      
      res.status(201).json(fleet);
    } catch (error) {
      res.status(400).json({ error: "Invalid fleet data" });
    }
  });

  app.post("/api/routers", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const router = await storage.createRouter(req.body);
      
      await storage.createAuditTrail({
        description: `Router ${router.name} (${router.identifier}) was created`,
        event: "Create",
        category: "Router",
        performedBy: req.user.name,
      });
      
      res.status(201).json(router);
    } catch (error) {
      res.status(400).json({ error: "Invalid router data" });
    }
  });

  app.post("/api/hotspot-users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const hotspotUser = await storage.createHotspotUser(req.body);
      
      // Get router info for audit trail
      const router = await storage.getRouter(hotspotUser.routerId);
      
      await storage.createAuditTrail({
        description: `Hotspot user ${hotspotUser.username} was created for router ${router?.name || 'Unknown'}`,
        event: "Create",
        category: "Hotspot User",
        performedBy: req.user.name,
      });
      
      res.status(201).json(hotspotUser);
    } catch (error) {
      res.status(400).json({ error: "Invalid hotspot user data" });
    }
  });

  app.post("/api/firewall-templates", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const firewallTemplate = await storage.createFirewallTemplate(req.body);
      
      await storage.createAuditTrail({
        description: `Firewall template ${firewallTemplate.name} was created`,
        event: "Create",
        category: "Firewall Template",
        performedBy: req.user.name,
      });
      
      res.status(201).json(firewallTemplate);
    } catch (error) {
      res.status(400).json({ error: "Invalid firewall template data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
