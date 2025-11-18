import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Hardcoded admin users
const ADMIN_USERS = [
  { username: 'snafu', password: 'random@123' },
  { username: 'sid', password: 'random@1234' }
];

export interface User {
  username: string;
}

export async function verifyCredentials(username: string, password: string): Promise<User | null> {
  const user = ADMIN_USERS.find(u => u.username === username);
  
  if (!user) {
    return null;
  }

  // In production, you'd use bcrypt.compare, but since these are hardcoded,
  // we'll do a simple string comparison
  const isValid = user.password === password;
  
  if (!isValid) {
    return null;
  }

  return { username };
}

export function generateToken(user: User): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}