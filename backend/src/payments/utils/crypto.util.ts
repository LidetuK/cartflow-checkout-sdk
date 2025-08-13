import { createCipheriv, createDecipheriv, createHash } from 'crypto';

/**
 * Encrypts a string using AES-256-CBC with PKCS#7 padding
 * @param plainText Plain text to encrypt
 * @param keyBase64 Base64 encoded encryption key (must be 32 bytes when decoded)
 * @param iv Initialization vector (must be exactly 16 bytes)
 * @returns Base64 encoded encrypted string
 */
export function aes256CbcEncryptToBase64(plainText: string, keyBase64: string, iv: string): string {
  try {
    // Convert key from base64 to buffer
    const key = Buffer.from(keyBase64, 'base64');
    
    // Ensure IV is exactly 16 bytes
    const ivBuffer = Buffer.from(iv, 'utf8');
    
    // Add PKCS#7 padding manually
    const blockSize = 16;
    const pad = blockSize - (plainText.length % blockSize);
    const paddingChar = String.fromCharCode(pad);
    const paddedText = plainText + paddingChar.repeat(pad);
    
    // Create cipher with CBC mode and disable auto-padding
    const cipher = createCipheriv('aes-256-cbc', key, ivBuffer);
    cipher.setAutoPadding(false); // Important: Disable automatic padding
    
    // Encrypt the padded text
    const encrypted = Buffer.concat([
      cipher.update(paddedText, 'utf8'),
      cipher.final()
    ]);
    
    // Convert to base64 and replace URL-unsafe characters
    const base64 = encrypted.toString('base64');
    return base64;
  } catch (error: unknown) {
    console.error('Encryption error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown encryption error';
    throw new Error(`Encryption failed: ${errorMessage}`);
  }
}

/**
 * Decrypts a base64 encoded string using AES-256-CBC
 * @param encryptedBase64 Base64 encoded encrypted string
 * @param keyBase64 Base64 encoded encryption key
 * @param iv Initialization vector (must be exactly 16 bytes)
 * @returns Decrypted string with PKCS#7 padding removed
 */
export function aes256CbcDecryptFromBase64(encryptedBase64: string, keyBase64: string, iv: string): string {
  try {
    const key = Buffer.from(keyBase64, 'base64');
    const ivBuffer = Buffer.from(iv, 'utf8');
    const encrypted = Buffer.from(encryptedBase64, 'base64');
    
    const decipher = createDecipheriv('aes-256-cbc', key, ivBuffer);
    decipher.setAutoPadding(false); // Disable auto-padding
    
    let decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    
    // Remove PKCS#7 padding
    const pad = decrypted[decrypted.length - 1];
    if (pad < 1 || pad > 16) {
      throw new Error('Invalid padding');
    }
    
    // Verify padding
    for (let i = 1; i <= pad; i++) {
      if (decrypted[decrypted.length - i] !== pad) {
        throw new Error('Invalid padding');
      }
    }
    
    return decrypted.slice(0, -pad).toString('utf8');
  } catch (error: unknown) {
    console.error('Decryption error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown decryption error';
    throw new Error(`Decryption failed: ${errorMessage}`);
  }
}

/**
 * Generates a SHA-256 hash of the input string (base64 encoded)
 * @param input String to hash
 * @returns Base64 encoded SHA-256 hash
 */
export function sha256Base64(input: string): string {
  try {
    const hash = createHash('sha256');
    hash.update(input);
    return hash.digest('base64');
  } catch (error: unknown) {
    console.error('Hashing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown hashing error';
    throw new Error(`Hashing failed: ${errorMessage}`);
  }
}


