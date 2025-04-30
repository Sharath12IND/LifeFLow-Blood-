import { promises as fs } from 'fs';
import path from 'path';
import { 
  Donor, InsertDonor, 
  BloodRequest, InsertBloodRequest,
  EmergencyAlert, InsertEmergencyAlert,
  BloodFact, InsertBloodFact,
  users, type User, type InsertUser
} from "@shared/schema";

// CSV file paths
const DONORS_CSV_PATH = path.join(process.cwd(), 'data/donors.csv');
const BLOOD_REQUESTS_CSV_PATH = path.join(process.cwd(), 'data/blood_requests.csv');
const EMERGENCY_ALERTS_CSV_PATH = path.join(process.cwd(), 'data/emergency_alerts.csv');
const BLOOD_FACTS_CSV_PATH = path.join(process.cwd(), 'data/blood_facts.csv');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Convert object to CSV row
function objectToCSV(obj: any): string {
  return Object.values(obj)
    .map(value => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
      if (value instanceof Date) return `"${value.toISOString()}"`;
      return `"${value}"`;
    })
    .join(',');
}

// Parse CSV row to object with specified schema
function csvRowToObject<T>(headers: string[], row: string): T {
  const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
  const obj: any = {};
  
  headers.forEach((header, index) => {
    let value = values[index] || '';
    // Remove quotes
    value = value.replace(/^"(.*)"$/, '$1');
    
    // Convert to appropriate type
    if (value === '') {
      obj[header] = null;
    } else if (value === 'true' || value === 'false') {
      obj[header] = value === 'true';
    } else if (!isNaN(Number(value)) && value.trim() !== '') {
      obj[header] = Number(value);
    } else if (value.match(/^\d{4}-\d{2}-\d{2}/) && !isNaN(Date.parse(value))) {
      obj[header] = new Date(value);
    } else {
      obj[header] = value;
    }
  });
  
  return obj as T;
}

// Read CSV file content
async function readCSV<T>(filePath: string): Promise<T[]> {
  try {
    await ensureDataDir();
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const rows = fileContent.trim().split('\n');
      
      if (rows.length === 0) return [];
      
      const headers = rows[0].split(',').map(header => header.trim().replace(/^"(.*)"$/, '$1'));
      
      return rows.slice(1).map(row => csvRowToObject<T>(headers, row));
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, return empty array
        return [];
      }
      throw error;
    }
  } catch (error) {
    console.error(`Error reading CSV file ${filePath}:`, error);
    return [];
  }
}

// Write data to CSV file
async function writeCSV<T>(filePath: string, data: T[]): Promise<void> {
  try {
    await ensureDataDir();
    
    if (data.length === 0) {
      await fs.writeFile(filePath, '', 'utf-8');
      return;
    }
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => objectToCSV(item));
    
    await fs.writeFile(filePath, [headers, ...rows].join('\n'), 'utf-8');
  } catch (error) {
    console.error(`Error writing to CSV file ${filePath}:`, error);
    throw error;
  }
}

// Append single record to CSV file
async function appendToCSV<T>(filePath: string, item: T): Promise<void> {
  try {
    await ensureDataDir();
    
    // Check if file exists and has content
    try {
      const stats = await fs.stat(filePath);
      
      if (stats.size === 0) {
        // Empty file, write headers + row
        const headers = Object.keys(item).join(',');
        const row = objectToCSV(item);
        await fs.writeFile(filePath, `${headers}\n${row}`, 'utf-8');
      } else {
        // File has content, just append new row
        const row = objectToCSV(item);
        await fs.appendFile(filePath, `\n${row}`, 'utf-8');
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create it with headers + row
        const headers = Object.keys(item).join(',');
        const row = objectToCSV(item);
        await fs.writeFile(filePath, `${headers}\n${row}`, 'utf-8');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error(`Error appending to CSV file ${filePath}:`, error);
    throw error;
  }
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Donor operations
  getAllDonors(): Promise<Donor[]>;
  getDonor(id: number): Promise<Donor | undefined>;
  getDonorsByBloodGroup(bloodGroup: string): Promise<Donor[]>;
  getDonorsByCity(city: string): Promise<Donor[]>;
  getDonorsByAvailability(isAvailable: boolean): Promise<Donor[]>;
  createDonor(donor: InsertDonor): Promise<Donor>;
  updateDonor(id: number, donor: Partial<Donor>): Promise<Donor | undefined>;
  
  // Blood request operations
  getAllBloodRequests(): Promise<BloodRequest[]>;
  getBloodRequest(id: number): Promise<BloodRequest | undefined>;
  getActiveBloodRequests(): Promise<BloodRequest[]>;
  createBloodRequest(request: InsertBloodRequest): Promise<BloodRequest>;
  markBloodRequestFulfilled(id: number): Promise<BloodRequest | undefined>;
  
  // Emergency alert operations
  getActiveEmergencyAlerts(): Promise<EmergencyAlert[]>;
  createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
  
  // Blood facts operations
  getAllBloodFacts(): Promise<BloodFact[]>;
  createBloodFact(fact: InsertBloodFact): Promise<BloodFact>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private donors: Map<number, Donor>;
  private bloodRequests: Map<number, BloodRequest>;
  private emergencyAlerts: Map<number, EmergencyAlert>;
  private bloodFacts: Map<number, BloodFact>;
  
  private userId: number;
  private donorId: number;
  private bloodRequestId: number;
  private emergencyAlertId: number;
  private bloodFactId: number;
  
  constructor() {
    this.users = new Map();
    this.donors = new Map();
    this.bloodRequests = new Map();
    this.emergencyAlerts = new Map();
    this.bloodFacts = new Map();
    
    this.userId = 1;
    this.donorId = 1;
    this.bloodRequestId = 1;
    this.emergencyAlertId = 1;
    this.bloodFactId = 1;
    
    // Initialize with some default blood facts
    this.initializeBloodFacts();
    this.initializeEmergencyAlerts();
    
    // Load data from CSV files if they exist
    this.loadData();
  }
  
  private async loadData() {
    try {
      // Load donors
      const donors = await readCSV<Donor>(DONORS_CSV_PATH);
      donors.forEach(donor => {
        this.donors.set(donor.id, donor);
        if (donor.id >= this.donorId) {
          this.donorId = donor.id + 1;
        }
      });
      
      // Load blood requests
      const bloodRequests = await readCSV<BloodRequest>(BLOOD_REQUESTS_CSV_PATH);
      bloodRequests.forEach(request => {
        this.bloodRequests.set(request.id, request);
        if (request.id >= this.bloodRequestId) {
          this.bloodRequestId = request.id + 1;
        }
      });
      
      // Load emergency alerts
      const emergencyAlerts = await readCSV<EmergencyAlert>(EMERGENCY_ALERTS_CSV_PATH);
      emergencyAlerts.forEach(alert => {
        this.emergencyAlerts.set(alert.id, alert);
        if (alert.id >= this.emergencyAlertId) {
          this.emergencyAlertId = alert.id + 1;
        }
      });
      
      // Load blood facts
      const bloodFacts = await readCSV<BloodFact>(BLOOD_FACTS_CSV_PATH);
      bloodFacts.forEach(fact => {
        this.bloodFacts.set(fact.id, fact);
        if (fact.id >= this.bloodFactId) {
          this.bloodFactId = fact.id + 1;
        }
      });
    } catch (error) {
      console.error("Error loading data from CSV files:", error);
    }
  }
  
  private initializeBloodFacts() {
    const facts: InsertBloodFact[] = [
      {
        title: "Blood Types Compatibility",
        content: "O- is the universal donor and AB+ is the universal recipient. Learn about other compatibilities.",
        icon: "tint",
        link: "/blood-facts/compatibility",
      },
      {
        title: "Donation Intervals",
        content: "Most donors can give blood every 56 days. Platelet donors can donate more frequently.",
        icon: "calendar-alt",
        link: "/blood-facts/intervals",
      },
      {
        title: "Health Benefits",
        content: "Regular blood donation can reduce the risk of heart disease and help in maintaining iron levels.",
        icon: "heartbeat",
        link: "/blood-facts/benefits",
      },
      {
        title: "Eligibility Requirements",
        content: "Learn about the age, weight, and health requirements for donating blood.",
        icon: "question-circle",
        link: "/blood-facts/eligibility",
      },
      {
        title: "Donation Process",
        content: "What to expect during a blood donation session, from registration to recovery.",
        icon: "procedures",
        link: "/blood-facts/process",
      },
      {
        title: "Blood Usage Statistics",
        content: "Learn how donated blood is used and why continued donations are crucial.",
        icon: "chart-pie",
        link: "/blood-facts/statistics",
      },
    ];
    
    facts.forEach(fact => {
      const id = this.bloodFactId++;
      const newFact: BloodFact = {
        ...fact,
        id,
        createdAt: new Date(),
      };
      this.bloodFacts.set(id, newFact);
    });
  }
  
  private initializeEmergencyAlerts() {
    const alerts: InsertEmergencyAlert[] = [
      {
        message: "URGENT NEED: O-negative blood required at City Hospital. Contact: +1-234-567-8901",
        contactNumber: "+1-234-567-8901",
        isActive: true,
      }
    ];
    
    alerts.forEach(alert => {
      const id = this.emergencyAlertId++;
      const newAlert: EmergencyAlert = {
        ...alert,
        id,
        createdAt: new Date(),
      };
      this.emergencyAlerts.set(id, newAlert);
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Donor operations
  async getAllDonors(): Promise<Donor[]> {
    return Array.from(this.donors.values());
  }
  
  async getDonor(id: number): Promise<Donor | undefined> {
    return this.donors.get(id);
  }
  
  async getDonorsByBloodGroup(bloodGroup: string): Promise<Donor[]> {
    return Array.from(this.donors.values()).filter(
      donor => donor.bloodGroup === bloodGroup
    );
  }
  
  async getDonorsByCity(city: string): Promise<Donor[]> {
    const lowercaseCity = city.toLowerCase();
    return Array.from(this.donors.values()).filter(
      donor => donor.city.toLowerCase().includes(lowercaseCity)
    );
  }
  
  async getDonorsByAvailability(isAvailable: boolean): Promise<Donor[]> {
    return Array.from(this.donors.values()).filter(
      donor => donor.isAvailable === isAvailable
    );
  }
  
  async createDonor(insertDonor: InsertDonor): Promise<Donor> {
    const id = this.donorId++;
    const donor: Donor = {
      ...insertDonor,
      id,
      createdAt: new Date(),
    };
    
    this.donors.set(id, donor);
    
    // Save to CSV
    await appendToCSV(DONORS_CSV_PATH, donor);
    
    return donor;
  }
  
  async updateDonor(id: number, updates: Partial<Donor>): Promise<Donor | undefined> {
    const donor = this.donors.get(id);
    
    if (!donor) {
      return undefined;
    }
    
    const updatedDonor: Donor = { ...donor, ...updates };
    this.donors.set(id, updatedDonor);
    
    // Update CSV - rewrite the entire file
    const allDonors = Array.from(this.donors.values());
    await writeCSV(DONORS_CSV_PATH, allDonors);
    
    return updatedDonor;
  }
  
  // Blood request operations
  async getAllBloodRequests(): Promise<BloodRequest[]> {
    return Array.from(this.bloodRequests.values());
  }
  
  async getBloodRequest(id: number): Promise<BloodRequest | undefined> {
    return this.bloodRequests.get(id);
  }
  
  async getActiveBloodRequests(): Promise<BloodRequest[]> {
    return Array.from(this.bloodRequests.values()).filter(
      request => !request.isFulfilled
    );
  }
  
  async createBloodRequest(insertRequest: InsertBloodRequest): Promise<BloodRequest> {
    const id = this.bloodRequestId++;
    const request: BloodRequest = {
      ...insertRequest,
      id,
      isFulfilled: false,
      createdAt: new Date(),
    };
    
    this.bloodRequests.set(id, request);
    
    // Save to CSV
    await appendToCSV(BLOOD_REQUESTS_CSV_PATH, request);
    
    return request;
  }
  
  async markBloodRequestFulfilled(id: number): Promise<BloodRequest | undefined> {
    const request = this.bloodRequests.get(id);
    
    if (!request) {
      return undefined;
    }
    
    const updatedRequest: BloodRequest = { ...request, isFulfilled: true };
    this.bloodRequests.set(id, updatedRequest);
    
    // Update CSV - rewrite the entire file
    const allRequests = Array.from(this.bloodRequests.values());
    await writeCSV(BLOOD_REQUESTS_CSV_PATH, allRequests);
    
    return updatedRequest;
  }
  
  // Emergency alert operations
  async getActiveEmergencyAlerts(): Promise<EmergencyAlert[]> {
    return Array.from(this.emergencyAlerts.values()).filter(
      alert => alert.isActive
    );
  }
  
  async createEmergencyAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const id = this.emergencyAlertId++;
    const alert: EmergencyAlert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
    };
    
    this.emergencyAlerts.set(id, alert);
    
    // Save to CSV
    await appendToCSV(EMERGENCY_ALERTS_CSV_PATH, alert);
    
    return alert;
  }
  
  // Blood facts operations
  async getAllBloodFacts(): Promise<BloodFact[]> {
    return Array.from(this.bloodFacts.values());
  }
  
  async createBloodFact(insertFact: InsertBloodFact): Promise<BloodFact> {
    const id = this.bloodFactId++;
    const fact: BloodFact = {
      ...insertFact,
      id,
      createdAt: new Date(),
    };
    
    this.bloodFacts.set(id, fact);
    
    // Save to CSV
    await appendToCSV(BLOOD_FACTS_CSV_PATH, fact);
    
    return fact;
  }
}

export const storage = new MemStorage();
