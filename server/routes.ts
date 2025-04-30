import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDonorSchema, 
  insertBloodRequestSchema, 
  insertEmergencyAlertSchema 
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all donors
  app.get("/api/donors", async (req: Request, res: Response) => {
    try {
      const donors = await storage.getAllDonors();
      return res.json(donors);
    } catch (error) {
      console.error("Error fetching donors:", error);
      return res.status(500).json({ message: "Failed to fetch donors" });
    }
  });

  // Get filtered donors
  app.get("/api/donors/filter", async (req: Request, res: Response) => {
    try {
      const { bloodGroup, city, availability } = req.query;
      let donors = await storage.getAllDonors();
      
      if (bloodGroup && typeof bloodGroup === 'string' && bloodGroup !== '') {
        donors = donors.filter(donor => donor.bloodGroup === bloodGroup);
      }
      
      if (city && typeof city === 'string' && city !== '') {
        donors = donors.filter(donor => 
          donor.city.toLowerCase().includes(city.toLowerCase())
        );
      }
      
      if (availability && typeof availability === 'string') {
        const isAvailable = availability === 'available';
        donors = donors.filter(donor => donor.isAvailable === isAvailable);
      }
      
      return res.json(donors);
    } catch (error) {
      console.error("Error filtering donors:", error);
      return res.status(500).json({ message: "Failed to filter donors" });
    }
  });

  // Get donor by ID
  app.get("/api/donors/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid donor ID" });
      }
      
      const donor = await storage.getDonor(id);
      
      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }
      
      return res.json(donor);
    } catch (error) {
      console.error("Error fetching donor:", error);
      return res.status(500).json({ message: "Failed to fetch donor" });
    }
  });

  // Create a new donor
  app.post("/api/donors", async (req: Request, res: Response) => {
    try {
      const result = insertDonorSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newDonor = await storage.createDonor(result.data);
      return res.status(201).json(newDonor);
    } catch (error) {
      console.error("Error creating donor:", error);
      return res.status(500).json({ message: "Failed to create donor" });
    }
  });

  // Update donor availability
  app.patch("/api/donors/:id/availability", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid donor ID" });
      }
      
      const schema = z.object({
        isAvailable: z.boolean(),
      });
      
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedDonor = await storage.updateDonor(id, {
        isAvailable: result.data.isAvailable,
      });
      
      if (!updatedDonor) {
        return res.status(404).json({ message: "Donor not found" });
      }
      
      return res.json(updatedDonor);
    } catch (error) {
      console.error("Error updating donor availability:", error);
      return res.status(500).json({ message: "Failed to update donor availability" });
    }
  });

  // Get all blood requests
  app.get("/api/blood-requests", async (req: Request, res: Response) => {
    try {
      const requests = await storage.getAllBloodRequests();
      return res.json(requests);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
      return res.status(500).json({ message: "Failed to fetch blood requests" });
    }
  });

  // Get active blood requests
  app.get("/api/blood-requests/active", async (req: Request, res: Response) => {
    try {
      const activeRequests = await storage.getActiveBloodRequests();
      return res.json(activeRequests);
    } catch (error) {
      console.error("Error fetching active blood requests:", error);
      return res.status(500).json({ message: "Failed to fetch active blood requests" });
    }
  });

  // Create a new blood request
  app.post("/api/blood-requests", async (req: Request, res: Response) => {
    try {
      const result = insertBloodRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newRequest = await storage.createBloodRequest(result.data);
      return res.status(201).json(newRequest);
    } catch (error) {
      console.error("Error creating blood request:", error);
      return res.status(500).json({ message: "Failed to create blood request" });
    }
  });

  // Mark blood request as fulfilled
  app.patch("/api/blood-requests/:id/fulfill", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blood request ID" });
      }
      
      const updatedRequest = await storage.markBloodRequestFulfilled(id);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: "Blood request not found" });
      }
      
      return res.json(updatedRequest);
    } catch (error) {
      console.error("Error marking blood request as fulfilled:", error);
      return res.status(500).json({ message: "Failed to mark blood request as fulfilled" });
    }
  });

  // Get active emergency alerts
  app.get("/api/emergency-alerts/active", async (req: Request, res: Response) => {
    try {
      const activeAlerts = await storage.getActiveEmergencyAlerts();
      return res.json(activeAlerts);
    } catch (error) {
      console.error("Error fetching active emergency alerts:", error);
      return res.status(500).json({ message: "Failed to fetch active emergency alerts" });
    }
  });

  // Create a new emergency alert
  app.post("/api/emergency-alerts", async (req: Request, res: Response) => {
    try {
      const result = insertEmergencyAlertSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newAlert = await storage.createEmergencyAlert(result.data);
      return res.status(201).json(newAlert);
    } catch (error) {
      console.error("Error creating emergency alert:", error);
      return res.status(500).json({ message: "Failed to create emergency alert" });
    }
  });

  // Get all blood facts
  app.get("/api/blood-facts", async (req: Request, res: Response) => {
    try {
      const facts = await storage.getAllBloodFacts();
      return res.json(facts);
    } catch (error) {
      console.error("Error fetching blood facts:", error);
      return res.status(500).json({ message: "Failed to fetch blood facts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
