// Simple local auth utilities — no external services
// Uses a JSON file as the user store and a cookie-based session token

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const USERS_FILE = path.join(process.cwd(), 'users_database.json');
const SESSION_SECRET = 'audioplanet-session-secret-2026'; // In production use env var

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + SESSION_SECRET).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function readUsers(): UserRecord[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeUsers(users: UserRecord[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): UserRecord | undefined {
  return readUsers().find(u => u.id === id);
}

export function createUser(fullName: string, email: string, phone: string, password: string): UserRecord {
  const users = readUsers();
  
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  
  const user: UserRecord = {
    id: crypto.randomUUID(),
    fullName,
    email: email.toLowerCase(),
    phone,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  
  users.push(user);
  writeUsers(users);
  return user;
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
