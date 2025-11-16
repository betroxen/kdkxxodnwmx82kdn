// --- CORE CONSTANTS ---
const MAX_HEX_VALUE = Math.pow(2, 56);
const FLOAT_HEX_LENGTH = 14; 

// --- UTILITIES ---

const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
};

const hexToArrayBuffer = (hex: string): ArrayBuffer => {
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes.buffer;
};


// --- 1. CORE CRYPTOGRAPHIC FUNCTIONS ---

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

    // Key must be imported for HMAC operation. Pad if needed for hex parsing.
    const keyBuffer = hexToArrayBuffer(key.length % 2 === 0 ? key : '0' + key); 

    const importedKey = await window.crypto.subtle.importKey(
        'raw', 
        keyBuffer, 
        { name: 'HMAC', hash: 'SHA-512' }, 
        false, 
        ['sign']
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
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
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
export const generateFloat = async (serverSeed: string, clientSeed: string, nonce: number, cursor: number): Promise<number> => {
    const inputString = `${clientSeed}:${nonce}:${cursor}`;

    const hash = await hmacSha512(serverSeed, inputString);

    const hexSegment = hash.substring(0, FLOAT_HEX_LENGTH); 

    const bytes = parseInt(hexSegment, 16);

    return bytes / MAX_HEX_VALUE;
};

/**
 * Generates a uniformly distributed integer up to maxExclusive.
 * @returns An object containing the generated value and the next cursor position.
 */
export const generateInteger = async (serverSeed: string, clientSeed: string, nonce: number, cursor: number, maxExclusive: number): Promise<{ value: number; nextCursor: number }> => {
    const float = await generateFloat(serverSeed, clientSeed, nonce, cursor);
    return {
        value: Math.floor(float * maxExclusive),
        nextCursor: cursor + 1,
    };
};


// --- 3. GAME-SPECIFIC IMPLEMENTATIONS ---

/**
 * Generates mine positions for the Mines game using a Fisher-Yates shuffle simulation.
 */
export const generateMines = async (serverSeed: string, clientSeed: string, nonce: number, minesCount: number): Promise<number[]> => {
    const boardSize = 25;
    const mineIndices: number[] = [];
    let currentCursor = 0;
    const availableTiles = Array.from({ length: boardSize }, (_, i) => i);

    for (let i = 0; i < minesCount; i++) {
        const result = await generateInteger(serverSeed, clientSeed, nonce, currentCursor, availableTiles.length);
        currentCursor = result.nextCursor;
        const pickIndex = result.value;

        mineIndices.push(availableTiles[pickIndex]);

        availableTiles.splice(pickIndex, 1);
    }

    return mineIndices.sort((a, b) => a - b);
};


/**
 * Generates a deterministic path for a Plinko ball drop.
 */
export const generatePlinkoPath = async (serverSeed: string, clientSeed: string, nonce: number, rows: number): Promise<number> => {
    // Generate a single integer that covers all possible 2^rows directional choices
    const result = await generateInteger(serverSeed, clientSeed, nonce, 0, Math.pow(2, rows));
    const directionsInt = result.value;

    let bucket = 0; 
    let temp = directionsInt; 

    // Iterate through the bits of the directionsInt
    for (let i = 0; i < rows; i++) {
        // The LSB (temp & 1) determines the move (0=Left, 1=Right)
        bucket += temp & 1; 
        temp >>= 1; // Shift to check the next bit
    }

    return bucket;
}