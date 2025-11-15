import CryptoJS from 'crypto-js';

// --- CORE CONSTANTS ---

// 2^56, used for high-precision conversion of the hex segment to a float [0, 1)
const MAX_HEX_VALUE = Math.pow(2, 56);

// The length of the HMAC segment we use for generating the float (14 hex chars = 56 bits)
const FLOAT_HEX_LENGTH = 14; 


// --- 1. CORE CRYPTOGRAPHIC FUNCTIONS ---

/**
 * Generates a standard SHA512 hash.
 */
export const sha512 = (message: string): string => {
    return CryptoJS.SHA512(message).toString(CryptoJS.enc.Hex);
};

/**
 * Generates an HMAC-SHA512 hash for provably fair integrity.
 */
export const hmacSha512 = (key: string, message: string): string => {
    return CryptoJS.HmacSHA512(message, key).toString(CryptoJS.enc.Hex);
};

/**
 * Generates a strong, random server seed (32 bytes / 64 hex chars).
 */
export const generateServerSeed = (): string => {
    // For environments supporting Node/browser crypto API (preferred)
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        // Convert Uint8Array to hex string manually for robustness
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Fallback: Use CryptoJS PRNG (less secure than window.crypto, but better than Math.random)
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
};


// --- 2. PROVABLY FAIR GENERATOR CORE ---

/**
 * Generates a high-precision float between [0, 1) using a segment of the HMAC-SHA512 hash.
 * @param serverSeed The unhashed server seed.
 * @param clientSeed The client seed.
 * @param nonce The game nonce.
 * @param cursor The cursor for multi-result games.
 * @returns A float between 0 and 1.
 */
export const generateFloat = (serverSeed: string, clientSeed: string, nonce: number, cursor: number): number => {
    // 1. Create the unique input string
    const inputString = `${clientSeed}:${nonce}:${cursor}`;
    
    // 2. Generate the HMAC hash
    const hash = hmacSha512(serverSeed, inputString);
    
    // 3. Extract the high-precision segment (56 bits from 14 hex chars)
    const hexSegment = hash.substring(0, FLOAT_HEX_LENGTH); 
    
    // 4. Convert hex to integer
    const bytes = parseInt(hexSegment, 16);
    
    // 5. Convert integer to high-precision float [0, 1)
    return bytes / MAX_HEX_VALUE;
};

/**
 * Generates a uniformly distributed integer up to maxExclusive.
 * @returns An object containing the generated value and the next cursor position.
 */
export const generateInteger = (serverSeed: string, clientSeed: string, nonce: number, cursor: number, maxExclusive: number): { value: number; nextCursor: number } => {
    const float = generateFloat(serverSeed, clientSeed, nonce, cursor);
    return {
        value: Math.floor(float * maxExclusive),
        nextCursor: cursor + 1,
    };
};


// --- 3. GAME-SPECIFIC IMPLEMENTATIONS ---

/**
 * Generates mine positions for the Mines game using a Fisher-Yates shuffle simulation.
 * Uses high-performance integer generation.
 */
export const generateMines = (serverSeed: string, clientSeed: string, nonce: number, minesCount: number): number[] => {
    const boardSize = 25;
    const mineIndices: number[] = [];
    let currentCursor = 0;
    // Create an array of available tile indices (0 to 24)
    const availableTiles = Array.from({ length: boardSize }, (_, i) => i);

    for (let i = 0; i < minesCount; i++) {
        // Generate a random index within the remaining available tiles array
        const result = generateInteger(serverSeed, clientSeed, nonce, currentCursor, availableTiles.length);
        currentCursor = result.nextCursor;
        const pickIndex = result.value;

        // Pick the tile index and add it to the mines list
        mineIndices.push(availableTiles[pickIndex]);
        
        // Remove the tile index from the available pool (simulate Fisher-Yates shuffle)
        availableTiles.splice(pickIndex, 1);
    }

    // Return the mine positions sorted for easy verification
    return mineIndices.sort((a, b) => a - b);
};


/**
 * Generates a deterministic path for a Plinko ball drop.
 */
export const generatePlinkoPath = (serverSeed: string, clientSeed: string, nonce: number, rows: number): number => {
    // Generate a single integer that covers all possible 2^rows directional choices
    const result = generateInteger(serverSeed, clientSeed, nonce, 0, Math.pow(2, rows));
    const directionsInt = result.value;

    let bucket = 0; // Starts at the center top (0 offset)
    let temp = directionsInt; // Use temp for bit manipulation

    // Iterate through the bits of the directionsInt
    for (let i = 0; i < rows; i++) {
        // The LSB (temp & 1) determines the move (0=Left, 1=Right)
        bucket += temp & 1; 
        temp >>= 1; // Shift to check the next bit
    }

    return bucket; // The final horizontal position (0 to rows)
};
