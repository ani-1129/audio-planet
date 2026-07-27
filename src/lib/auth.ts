// Database-backed auth utilities using Prisma
import { db } from './db';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'audioplanet-session-secret-2026';

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: Date;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + SESSION_SECRET).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  return await db.user.findUnique({
    where: { email: email.toLowerCase() }
  });
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  return await db.user.findUnique({
    where: { id }
  });
}

export async function createUser(fullName: string, email: string, phone: string, password: string): Promise<UserRecord> {
  // Check if user exists
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  return await db.user.create({
    data: {
      fullName,
      email: email.toLowerCase(),
      phone,
      passwordHash: hashPassword(password)
    }
  });
}

// Session token: simple signed token = base64(userId) + "." + hmac
export function createSessionToken(userId: string): string {
  const payload = Buffer.from(userId).toString('base64');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [payload, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  
  if (signature !== expectedSig) return null;
  
  try {
    return Buffer.from(payload, 'base64').toString('utf8');
  } catch {
    return null;
  }
}
