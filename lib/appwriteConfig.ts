import { Client, Account, Databases, ID } from 'appwrite'; // 'import' is now lowercase

// Pulling credentials from the secure .env file
const PROJECT_ID: string = import.meta.env.VITE_APPWRITE_PROJECT_ID; 
const API_ENDPOINT: string = import.meta.env.VITE_APPWRITE_ENDPOINT;

// Fail fast: essential for production readiness
if (!PROJECT_ID || !API_ENDPOINT) {
    // This will now successfully throw an error to the console, instead of a silent crash
    throw new Error("Appwrite credentials not defined in .env file."); 
}

const client = new Client();

// Set the endpoint and project ID for the client
client
    .setEndpoint(API_ENDPOINT)
    .setProject(PROJECT_ID); 

// Export the core services for use throughout your app
export const account = new Account(client);
export const databases = new Databases(client);
// Note: You may need to export 'storage' if you plan to use file uploads.
export { ID };
