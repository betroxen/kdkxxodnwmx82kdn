import { Client, Account, Databases, ID } from 'appwrite'; 

// CRITICAL: Pulling credentials directly from the secure environment during build/runtime.
const PROJECT_ID: string = import.meta.env.VITE_APPWRITE_PROJECT_ID; 
const API_ENDPOINT: string = import.meta.env.VITE_APPWRITE_ENDPOINT;

// Fail fast check: If these are missing, the app cannot operate.
if (!PROJECT_ID || !API_ENDPOINT) {
    throw new Error("Appwrite credentials (PROJECT_ID or ENDPOINT) are not defined in the environment variables."); 
}

// 1. Initialize the Core Client
const client = new Client();

client
    .setEndpoint(API_ENDPOINT)
    .setProject(PROJECT_ID); 

// 2. Export the Core Appwrite Services
export const account = new Account(client);
export const databases = new Databases(client);

// NOTE: Uncomment and initialize 'storage' if you implement file uploads (Avatars, Logos, etc.)
// export const storage = new Storage(client);

// Export ID for document creation, crucial for unique/predictable IDs
export { ID };