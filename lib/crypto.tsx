// This file is refactored to use the native browser SubtleCrypto API, 
// eliminating the external dependency on 'crypto-js' that was failing the build.

// --- CORE CONSTANTS ---
// 2^56, used for high-precision conversion of the hex segment to a float [0, 1)
const MAX_HEX_VALUE = Math.pow(2, 56);

// The length of the HMAC segment we use for generating the float (14 hex chars = 56 bits)
const FLOAT_HEX_LENGTH = 14; 

// --- UTILITIES ---

/**
 * Converts an ArrayBuffer to a hexadecimal string.
 */
const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
};

/**
 * Converts a hexadecimal string to an ArrayBuffer.
 */
const hexToArrayBuffer = (hex: string): ArrayBuffer => {
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes.buffer;
};


// --- 1. CORE CRYPTOGRAPHIC FUNCTIONS (Now Asynchronous) ---

/**
 * Generates a standard SHA-512 hash using native browser crypto.
 */
export const sha512 = async (message: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    return arrayBufferToHex(hashBuffer);
};

/**
 * Generates an HMAC-SHA-512 hash for provably fair integrity.
 */
export const hmacSha512 = async (key: string, message: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    // Key must be imported for HMAC operation
    const keyBuffer = hexToArrayBuffer(key.length % 2 === 0 ? key : '0' + key); // Pad if needed for even hex length
    
    const importedKey = await window.crypto.subtle.importKey(
        'raw', 
        keyBuffer, 
        { name: 'HMAC', hash: 'SHA-512' }, 
        false, 
        ['sign'] // Use 'sign' for generating HMAC
    );

    const signatureBuffer = await window.crypto.subtle.sign(
        'HMAC', 
        importedKey, 
        data
    );

    return arrayBufferToHex(signatureBuffer);
};

/**
 * Generates a strong, random server seed (32 bytes / 64 hex chars).
 */
export const generateServerSeed = (): string => {
    const array = new Uint8Array(32);
    // window.crypto is mandatory in a secure browser context
    window.crypto.getRandomValues(array); 
    // Convert Uint8Array to hex string
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};


// --- 2. PROVABLY FAIR GENERATOR CORE (Now Asynchronous) ---

/**
 * Generates a high-precision float between [0, 1) using a segment of the HMAC-SHA512 hash.
 * This function is now ASYNCHRONOUS.
 * @param serverSeed The unhashed server seed.
 * @param clientSeed The client seed.
 * @param nonce The game nonce.
 * @param cursor The cursor for multi-result games.
 * @returns A float between 0 and 1.
 */
export const generateFloat = async (serverSeed: string, clientSeed: string, nonce: number, cursor: number): Promise<number> => {
    // 1. Create the unique input string
    const inputString = `${clientSeed}:${nonce}:${cursor}`;

    // 2. Generate the HMAC hash (AWAITING the async operation)
    const hash = await hmacSha512(serverSeed, inputString);

    // 3. Extract the high-precision segment (56 bits from 14 hex chars)
    const hexSegment = hash.substring(0, FLOAT_HEX_LENGTH); 

    // 4. Convert hex to integer
    const bytes = parseInt(hexSegment, 16);

    // 5. Convert integer to high-precision float [0, 1)
    return bytes / MAX_HEX_VALUE;
};

/**
 * Generates a uniformly distributed integer up to maxExclusive.
 * This function is now ASYNCHRONOUS.
 * @returns An object containing the generated value and the next cursor position.
 */
export const generateInteger = async (serverSeed: string, clientSeed: string, nonce: number, cursor: number, maxExclusive: number): Promise<{ value: number; nextCursor: number }> => {
    const float = await generateFloat(serverSeed, clientSeed, nonce, cursor);
    return {
        value: Math.floor(float * maxExclusive),
        nextCursor: cursor + 1,
    };
};


// --- 3. GAME-SPECIFIC IMPLEMENTATIONS (Now Asynchronous) ---

/**
 * Generates mine positions for the Mines game using a Fisher-Yates shuffle simulation.
 * This function is now ASYNCHRONOUS.
 */
export const generateMines = async (serverSeed: string, clientSeed: string, nonce: number, minesCount: number): Promise<number[]> => {
    const boardSize = 25;
    const mineIndices: number[] = [];
    let currentCursor = 0;
    // Create an array of available tile indices (0 to 24)
    const availableTiles = Array.from({ length: boardSize }, (_, i) => i);

    for (let i = 0; i < minesCount; i++) {
        // Generate a random index within the remaining available tiles array (AWAITING)
        const result = await generateInteger(serverSeed, clientSeed, nonce, currentCursor, availableTiles.length);
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
 * This function is now ASYNCHRONOUS.
 */
export const generatePlinkoPath = async (serverSeed: string, clientSeed: string, nonce: number, rows: number): Promise<number> => {
    // Generate a single integer that covers all possible 2^rows directional choices (AWAITING)
    const result = await generateInteger(serverSeed, clientSeed, nonce, 0, Math.pow(2, rows));
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