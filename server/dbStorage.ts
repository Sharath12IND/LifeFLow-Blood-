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
      throw error;
    }
  }
  
  private async initializeBloodFacts() {
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
    
    await db.insert(bloodFacts).values(facts);
  }
  
  private async initializeEmergencyAlerts() {
    const alerts: InsertEmergencyAlert[] = [
      {
        message: "URGENT NEED: O-negative blood required at City Hospital. Contact: +1-234-567-8901",
        contactNumber: "+1-234-567-8901",
        isActive: true,
      }
    ];
    
    await db.insert(emergencyAlerts).values(alerts);
  }
  
  private async initializeDummyDonors() {
    const dummyDonors: InsertDonor[] = [
      {
        fullName: "Nitish Kumar",
        age: 28,
        bloodGroup: "O+",
        city: "New York",
        pincode: "10001",
        contactNumber: "123-456-7890",
        lastDonationDate: "2022-12-15",
        healthCondition: "excellent",
        isAvailable: true,
        isAnonymous: false,
        donationCount: 5,
      },
      {
        fullName: "Sharath Bandaari",
        age: 32,
        bloodGroup: "A-",
        city: "Los Angeles",
        pincode: "90001",
        contactNumber: "213-555-1234",
        lastDonationDate: "2023-03-10",
        healthCondition: "good",
        isAvailable: true,
        isAnonymous: false,
        donationCount: 3,
      },
      {
        fullName: "Archanamma",
        age: 145,
        bloodGroup: "B+",
        city: "Chicago",
        pincode: "60601",
        contactNumber: "312-555-6789",
        lastDonationDate: "2023-05-22",
        healthCondition: "good",
        isAvailable: false,
        isAnonymous: false,
        donationCount: 12,
      },
      {
        fullName: "Nannna",
        age: 29,
        bloodGroup: "AB+",
        city: "Houston",
        pincode: "77001",
        contactNumber: "832-555-4321",
        lastDonationDate: "2023-02-05",
        healthCondition: "excellent",
        isAvailable: true,
        isAnonymous: true,
        donationCount: 2,
      },
      {
        fullName: "Karthik Reddy",
        age: 38,
        bloodGroup: "O-",
        city: "Phoenix",
        pincode: "85001",
        contactNumber: "602-555-8765",
        lastDonationDate: "2022-10-30",
        healthCondition: "good",
        isAvailable: true,
        isAnonymous: false,
        donationCount: 8,
      }
    ];
    
    await db.insert(donors).values(dummyDonors);
    
    const bloodRequestData: InsertBloodRequest = {
      patientName: "Sharath Bandaari",
      bloodGroup: "A+",
      hospitalName: "Apollo Hospital",
      hospitalLocation: "Jubilee Hills, Hyderabad",
      contactNumber: "9876543210",
      urgency: "high",
      additionalInfo: "Need blood for surgery scheduled for tomorrow morning",
      isFulfilled: false,
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
  
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  // Donor operations
  async getAllDonors(): Promise<Donor[]> {
    return await db.select().from(donors).orderBy(desc(donors.createdAt));
  }
  
  async getDonor(id: number): Promise<Donor | undefined> {
    const [donor] = await db.select().from(donors).where(eq(donors.id, id));
    return donor;
  }
  
  async getDonorsByBloodGroup(bloodGroup: string): Promise<Donor[]> {
    return await db.select()
      .from(donors)
      .where(eq(donors.bloodGroup, bloodGroup))
      .orderBy(desc(donors.createdAt));
  }
  
  async getDonorsByCity(city: string): Promise<Donor[]> {
    return await db.select()
      .from(donors)
      .where(sql`LOWER(${donors.city}) LIKE LOWER(${'%' + city + '%'})`)
      .orderBy(desc(donors.createdAt));
  }
  
  async getDonorsByAvailability(isAvailable: boolean): Promise<Donor[]> {
    return await db.select()
      .from(donors)
      .where(eq(donors.isAvailable, isAvailable))
      .orderBy(desc(donors.createdAt));
  }
  
  async createDonor(donorData: InsertDonor): Promise<Donor> {
    const [donor] = await db.insert(donors).values(donorData).returning();
    return donor;
  }
  
  async updateDonor(id: number, updates: Partial<Donor>): Promise<Donor | undefined> {
    const [donor] = await db.update(donors)
      .set(updates)
      .where(eq(donors.id, id))
      .returning();
    
    return donor;
  }
  
  // Blood request operations
  async getAllBloodRequests(): Promise<BloodRequest[]> {
    return await db.select()
      .from(bloodRequests)
      .orderBy(desc(bloodRequests.createdAt));
  }
  
  async getBloodRequest(id: number): Promise<BloodRequest | undefined> {
    const [request] = await db.select()
      .from(bloodRequests)
      .where(eq(bloodRequests.id, id));
    
    return request;
  }
  
  async getActiveBloodRequests(): Promise<BloodRequest[]> {
    return await db.select()
      .from(bloodRequests)
      .where(eq(bloodRequests.isFulfilled, false))
      .orderBy(desc(bloodRequests.createdAt));
  }
  
  async createBloodRequest(requestData: InsertBloodRequest): Promise<BloodRequest> {
    const [request] = await db.insert(bloodRequests)
      .values({
        ...requestData,
        additionalInfo: requestData.additionalInfo || null,
        isFulfilled: false
      })
      .returning();
    
    return request;
  }
  
  async markBloodRequestFulfilled(id: number): Promise<BloodRequest | undefined> {
    const [request] = await db.update(bloodRequests)
      .set({ isFulfilled: true })
      .where(eq(bloodRequests.id, id))
      .returning();
    
    return request;
  }
  
  // Emergency alert operations
  async getActiveEmergencyAlerts(): Promise<EmergencyAlert[]> {
    return await db.select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.isActive, true))
      .orderBy(desc(emergencyAlerts.createdAt));
  }
  
  async createEmergencyAlert(alertData: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const [alert] = await db.insert(emergencyAlerts)
      .values(alertData)
      .returning();
    
    return alert;
  }
  
  // Blood facts operations
  async getAllBloodFacts(): Promise<BloodFact[]> {
    return await db.select()
      .from(bloodFacts)
      .orderBy(desc(bloodFacts.createdAt));
  }
  
  async createBloodFact(factData: InsertBloodFact): Promise<BloodFact> {
    const [fact] = await db.insert(bloodFacts)
      .values(factData)
      .returning();
    
    return fact;
  }
}