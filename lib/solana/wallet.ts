import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * Simple encryption for hackathon purposes.
 * Encrypts a string using a key as a salt.
 */
function encrypt(text: string, key: string): string {
  const textChars = text.split('').map(c => c.charCodeAt(0));
  const keyChars = key.split('').map(c => c.charCodeAt(0));
  
  const encrypted = textChars.map((c, i) => {
    return c ^ keyChars[i % keyChars.length];
  });
  
  return btoa(String.fromCharCode(...encrypted));
}

/**
 * Simple decryption for hackathon purposes.
 */
function decrypt(encoded: string, key: string): string {
  const encrypted = atob(encoded).split('').map(c => c.charCodeAt(0));
  const keyChars = key.split('').map(c => c.charCodeAt(0));
  
  const decrypted = encrypted.map((c, i) => {
    return c ^ keyChars[i % keyChars.length];
  });
  
  return String.fromCharCode(...decrypted);
}

const SESSION_STORAGE_KEY = 'capsule_session_key';

export function generateSessionKeypair(): Keypair {
  return Keypair.generate();
}

export function saveSessionKeypair(keypair: Keypair, vaultPublicKey: string) {
  if (typeof window === 'undefined') return;
  
  const secretKeyString = bs58.encode(keypair.secretKey);
  const encrypted = encrypt(secretKeyString, vaultPublicKey);
  
  sessionStorage.setItem(SESSION_STORAGE_KEY, encrypted);
}

export function getSessionKeypair(vaultPublicKey: string): Keypair | null {
  if (typeof window === 'undefined') return null;
  
  const encrypted = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!encrypted) return null;
  
  try {
    const decrypted = decrypt(encrypted, vaultPublicKey);
    const secretKey = bs58.decode(decrypted);
    return Keypair.fromSecretKey(secretKey);
  } catch (err) {
    console.error('Failed to decrypt session keypair', err);
    return null;
  }
}

export function clearSessionKeypair() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
