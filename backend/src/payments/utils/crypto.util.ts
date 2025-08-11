import { createCipheriv, createDecipheriv, createHash } from 'crypto';

export interface EncryptionResult {
  encryptedBase64: string;
  hashBase64: string;
}

export function aes256CbcEncryptToBase64(plainText: string, keyBase64: string, iv: string): string {
  const key = Buffer.from(keyBase64, 'base64');
  const ivBuffer = Buffer.from(iv, 'utf8');
  const cipher = createCipheriv('aes-256-cbc', key, ivBuffer);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  return encrypted.toString('base64');
}

export function aes256CbcDecryptFromBase64(encryptedBase64: string, keyBase64: string, iv: string): string {
  const key = Buffer.from(keyBase64, 'base64');
  const ivBuffer = Buffer.from(iv, 'utf8');
  const decipher = createDecipheriv('aes-256-cbc', key, ivBuffer);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

export function sha256Base64(inputBase64: string): string {
  const hash = createHash('sha256');
  hash.update(inputBase64);
  return hash.digest('base64');
}


