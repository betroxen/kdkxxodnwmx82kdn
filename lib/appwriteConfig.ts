// src/appwriteConfig.ts
import { Client, Account, Databases, ID } from 'appwrite';

// Pull the ID from the .env file (Vite handles this during build)
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID; 
const API_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';

if (!PROJECT_ID) {
    throw new Error("VITE_APPWRITE_PROJECT_ID is not defined in environment variables.");
}

const client = new Client();
client
    .setEndpoint(API_ENDPOINT)
    .setProject(PROJECT_ID); 

export const account = new Account(client);
export const databases = new Databases(client);
export { ID }; 
