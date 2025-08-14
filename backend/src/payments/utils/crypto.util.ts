import * as crypto from 'crypto';

export class CryptoUtil {
  private readonly iv = '0123456789abcdef';

  aes256CbcEncryptToBase64(text: string, keyBase64: string): string {
    const key = Buffer.from(keyBase64, 'base64');
    const cipher = crypto.createCipher('aes-256-cbc', key);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    return encrypted;
  }

  aes256CbcDecryptFromBase64(encryptedBase64: string, keyBase64: string): string {
    const key = Buffer.from(keyBase64, 'base64');
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    decipher.setAutoPadding(true);
    
    let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  sha256Base64(input: string): string {
    return crypto.createHash('sha256').update(input, 'utf8').digest('base64');
  }

  sha256Hex(input: string): string {
    return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
  }
}

// Legacy functions for backward compatibility
export function aes256CbcEncryptToBase64(text: string, keyBase64: string, iv: string): string {
  const cryptoUtil = new CryptoUtil();
  return cryptoUtil.aes256CbcEncryptToBase64(text, keyBase64);
}

export function aes256CbcDecryptFromBase64(encryptedBase64: string, keyBase64: string, iv: string): string {
  const cryptoUtil = new CryptoUtil();
  return cryptoUtil.aes256CbcDecryptFromBase64(encryptedBase64, keyBase64);
}

export function sha256Base64(input: string): string {
  const cryptoUtil = new CryptoUtil();
  return cryptoUtil.sha256Base64(input);
}


