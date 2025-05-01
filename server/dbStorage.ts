import { User, InsertUser, Donor, InsertDonor, BloodRequest, InsertBloodRequest, EmergencyAlert, InsertEmergencyAlert, BloodFact, InsertBloodFact } from '@shared/schema';
import { db } from './db';
import { users, donors, bloodRequests, emergencyAlerts, bloodFacts } from '@shared/schema';
import { eq, and, like, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize database with default data if empty
    this.initializeData();
  }
  
  private async initializeData() {
    try {
      // Check if we need to seed the database with initial data
      const donorCount = await db.select({ count: sql<number>`count(*)` }).from(donors);
      
      if (donorCount[0].count === 0) {
        await this.initializeDummyDonors();
      }
      
      const factCount = await db.select({ count: sql<number>`count(*)` }).from(bloodFacts);
      if (factCount[0].count === 0) {
        await this.initializeBloodFacts();
      }
      
      const alertCount = await db.select({ count: sql<number>`count(*)` }).from(emergencyAlerts);
      if (alertCount[0].count === 0) {
        await this.initializeEmergencyAlerts();
      }
      
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
  
  private async initializeBloodFacts() {
    const facts = [
      {
        title: "Blood Types Compatibility",
        content: "O- is the universal donor and AB+ is the universal recipient. Learn about other compatibilities.",
        icon: "tint",
        link: "/blood-facts/compatibility",
        createdAt: new Date(),
      },
      {
        title: "Donation Intervals",
        content: "Most donors can give blood every 56 days. Platelet donors can donate more frequently.",
        icon: "calendar-alt",
        link: "/blood-facts/intervals",
        createdAt: new Date(),
      },
      {
        title: "Health Benefits",
        content: "Regular blood donation can reduce the risk of heart disease and help in maintaining iron levels.",
        icon: "heartbeat",
        link: "/blood-facts/benefits",
        createdAt: new Date(),
      },
      {
        title: "Eligibility Requirements",
        content: "Learn about the age, weight, and health requirements for donating blood.",
        icon: "question-circle",
        link: "/blood-facts/eligibility",
        createdAt: new Date(),
      },
      {
        title: "Donation Process",
        content: "What to expect during a blood donation session, from registration to recovery.",
        icon: "procedures",
        link: "/blood-facts/process",
        createdAt: new Date(),
      },
      {
        title: "Blood Usage Statistics",
        content: "Learn how donated blood is used and why continued donations are crucial.",
        icon: "chart-pie",
        link: "/blood-facts/statistics",
        createdAt: new Date(),
      },
    ];
    
    for (const fact of facts) {
      await db.insert(bloodFacts).values(fact);
    }
  }
  
  private async initializeEmergencyAlerts() {
    const alerts = [
      {
        message: "URGENT NEED: O-negative blood required at City Hospital. Contact: +1-234-567-8901",
        contactNumber: "+1-234-567-8901",
        isActive: true,
        createdAt: new Date(),
      }
    ];
    
    for (const alert of alerts) {
      await db.insert(emergencyAlerts).values(alert);
    }
  }
  
  private async initializeDummyDonors() {
    const dummyDonors = [
      {
        fullName: "John Smith",
        age: 28,
        bloodGroup: "O+",
        city: "New York",
        pincode: "10001",
        contactNumber: "123-456-7890",
        lastDonationDate: new Date(2022, 11, 15),
        healthCondition: "excellent",
        isAvailable: true,
        isAnonymous: false,
        donationCount: 5,
        createdAt: new Date(),
      },
      {
        fullName: "Emma Johnson",
        age: 32,
        bloodGroup: "A-",
        city: "Los Angeles",
        pincode: "90001",
        contactNumber: "213-555-1234",
        lastDonationDate: new Date(2023, 2, 10),
        healthCondition: "good",
        isAvailable: true,
        isAnonymous: false,
        donationCount: 3,
        createdAt: new Date(),
      },
      {
        fullName: "Michael Williams",
        age: 45,
        bloodGroup: "B+",
        city: "Chicago",
        pincode: "60601",
        contactNumber: "312-555-6789",
        lastDonationDate: new Date(2023, 4, 22),
        healthCondition: "good",
        isAvailable: false,
        isAnonymous: false,
        donationCount: 12,
        createdAt: new Date(),
      },
      {
        fullName: "Jennifer Brown",
        age: 29,
        bloodGroup: "AB+",
        city: "Houston",
        pincode: "77001",
        contactNumber: "832-555-4321",
        lastDonationDate: new Date(2023, 1, 5),
        healthCondition: "excellent",
        isAvailable: true,
        isAnonymous: true,
        donationCount: 2,
        createdAt: new Date(),
      },
      {
        fullName: "David Jones",
        age: 38,
        bloodGroup: "O-",
        city: "Phoenix",
        pincode: "85001",
        contactNumber: "602-555-8765",
        lastDonationDate: new Date(2022, 9, 30),
        healthCondition: "good",
        isAvailable: true,
        isAnonymous: false,
        donationCount: 8,
        createdAt: new Date(),
      }
    ];
    
    // Create dummy donors
    for (const donor of dummyDonors) {
      await db.insert(donors).values(donor);
    }
    
    // Create a blood request
    const bloodRequestData = {
      patientName: "Sharath Bandaari",
      bloodGroup: "A+",
      hospitalName: "Apollo Hospital",
      hospitalLocation: "Jubilee Hills, Hyderabad",
      contactNumber: "9876543210",
      urgency: "high",
      additionalInfo: "Need blood for surgery scheduled for tomorrow morning",
      isFulfilled: false,
      createdAt: new Date(),
    };
    
    await db.insert(bloodRequests).values(bloodRequestData);
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Donor operations
  async getAllDonors(): Promise<Donor[]> {
    return await db.select().from(donors);
  }
  
  async getDonor(id: number): Promise<Donor | undefined> {
    const result = await db.select().from(donors).where(eq(donors.id, id));
    return result[0];
  }
  
  async getDonorsByBloodGroup(bloodGroup: string): Promise<Donor[]> {
    return await db.select().from(donors).where(eq(donors.bloodGroup, bloodGroup));
  }
  
  async getDonorsByCity(city: string): Promise<Donor[]> {
    return await db.select().from(donors).where(
      sql`LOWER(${donors.city}) LIKE LOWER(${'%' + city + '%'})`
    );
  }
  
  async getDonorsByAvailability(isAvailable: boolean): Promise<Donor[]> {
    return await db.select().from(donors).where(eq(donors.isAvailable, isAvailable));
  }
  
  async createDonor(insertDonor: InsertDonor): Promise<Donor> {
    const result = await db.insert(donors).values({
      ...insertDonor,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }
  
  async updateDonor(id: number, updates: Partial<Donor>): Promise<Donor | undefined> {
    const result = await db.update(donors)
      .set(updates)
      .where(eq(donors.id, id))
      .returning();
    
    return result[0];
  }
  
  // Blood request operations
  async getAllBloodRequests(): Promise<BloodRequest[]> {
    return await db.select().from(bloodRequests).orderBy(desc(bloodRequests.createdAt));
  }
  
  async getBloodRequest(id: number): Promise<BloodRequest | undefined> {
    const result = await db.select().from(bloodRequests).where(eq(bloodRequests.id, id));
    return result[0];
  }
  
  async getActiveBloodRequests(): Promise<BloodRequest[]> {
    return await db.select()
      .from(bloodRequests)
      .where(eq(bloodRequests.isFulfilled, false))
      .orderBy(desc(bloodRequests.createdAt));
  }
  
  async createBloodRequest(insertRequest: InsertBloodRequest): Promise<BloodRequest> {
    // Make sure additionalInfo is not undefined
    const requestData = {
      ...insertRequest,
      additionalInfo: insertRequest.additionalInfo || null,
      isFulfilled: false,
      createdAt: new Date(),
    };
    
    const result = await db.insert(bloodRequests).values(requestData).returning();
    return result[0];
  }
  
  async markBloodRequestFulfilled(id: number): Promise<BloodRequest | undefined> {
    const result = await db.update(bloodRequests)
      .set({ isFulfilled: true })
      .where(eq(bloodRequests.id, id))
      .returning();
    
    return result[0];
  }
  
  // Emergency alert operations
  async getActiveEmergencyAlerts(): Promise<EmergencyAlert[]> {
    return await db.select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.isActive, true))
      .orderBy(desc(emergencyAlerts.createdAt));
  }
  
  async createEmergencyAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const alertData = {
      ...insertAlert,
      createdAt: new Date(),
    };
    
    const result = await db.insert(emergencyAlerts).values(alertData).returning();
    return result[0];
  }
  
  // Blood facts operations
  async getAllBloodFacts(): Promise<BloodFact[]> {
    return await db.select().from(bloodFacts);
  }
  
  async createBloodFact(insertFact: InsertBloodFact): Promise<BloodFact> {
    const factData = {
      ...insertFact,
      createdAt: new Date(),
    };
    
    const result = await db.insert(bloodFacts).values(factData).returning();
    return result[0];
  }
}