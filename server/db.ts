// This file is kept for compatibility but no longer uses a PostgreSQL database
// The application now uses CSV files for data storage

import * as schema from "@shared/schema";

// Create dummy exports to maintain compatibility with existing code
export const db = {
  select: () => {
    console.warn("Database queries are no longer used. Using CSV storage instead.");
    return {
      from: () => {
        return {
          where: () => [],
          orderBy: () => []
        };
      }
    };
  },
  insert: () => {
    console.warn("Database queries are no longer used. Using CSV storage instead.");
    return {
      values: () => {
        return {
          returning: () => []
        };
      }
    };
  },
  update: () => {
    console.warn("Database queries are no longer used. Using CSV storage instead.");
    return {
      set: () => {
        return {
          where: () => {
            return {
              returning: () => []
            };
          }
        };
      }
    };
  }
};
