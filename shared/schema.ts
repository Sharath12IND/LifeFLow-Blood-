import { pgTable, text, serial, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table (keeping this for authentication if needed later)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Donor table for blood donors
export const donors = pgTable("donors", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  bloodGroup: text("blood_group").notNull(),
  city: text("city").notNull(),
  pincode: text("pincode").notNull(),
  contactNumber: text("contact_number").notNull(),
  lastDonationDate: date("last_donation_date"),
  healthCondition: text("health_condition").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  donationCount: integer("donation_count").notNull().default(0),
  createdAt: date("created_at").notNull().default(new Date()),
});

export const insertDonorSchema = createInsertSchema(donors).omit({
  id: true,
  createdAt: true,
});

// Blood requests table
export const bloodRequests = pgTable("blood_requests", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  bloodGroup: text("blood_group").notNull(),
  hospitalName: text("hospital_name").notNull(),
  hospitalLocation: text("hospital_location").notNull(),
  contactNumber: text("contact_number").notNull(),
  urgency: text("urgency").notNull(), // Low, Medium, High
  additionalInfo: text("additional_info"),
  isFulfilled: boolean("is_fulfilled").notNull().default(false),
  createdAt: date("created_at").notNull().default(new Date()),
});

export const insertBloodRequestSchema = createInsertSchema(bloodRequests).omit({
  id: true,
  isFulfilled: true,
  createdAt: true,
});

// Emergency alerts table
export const emergencyAlerts = pgTable("emergency_alerts", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  contactNumber: text("contact_number"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: date("created_at").notNull().default(new Date()),
});

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).omit({
  id: true,
  createdAt: true,
});

// Blood facts content table
export const bloodFacts = pgTable("blood_facts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  icon: text("icon").notNull(),
  link: text("link"),
  createdAt: date("created_at").notNull().default(new Date()),
});

export const insertBloodFactSchema = createInsertSchema(bloodFacts).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Donor = typeof donors.$inferSelect;
export type InsertDonor = z.infer<typeof insertDonorSchema>;

export type BloodRequest = typeof bloodRequests.$inferSelect;
export type InsertBloodRequest = z.infer<typeof insertBloodRequestSchema>;

export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;

export type BloodFact = typeof bloodFacts.$inferSelect;
export type InsertBloodFact = z.infer<typeof insertBloodFactSchema>;
