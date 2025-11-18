import { NextRequest } from 'next/server';
import { User } from './auth';

export function getCurrentUser(request: NextRequest): User | null {
  const userHeader = request.headers.get('x-user');
  if (!userHeader) {
    return null;
  }
  
  try {
    return JSON.parse(userHeader) as User;
  } catch {
    return null;
  }
}