import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer paise into standard Indian Rupee notation (e.g., ₹1,34,900).
 * 1 INR = 100 paise.
 */
export function formatINR(paise: number | undefined | null): string {
  if (paise === undefined || paise === null || isNaN(paise)) {
    return '₹0';
  }
  const rupees = Math.floor(paise / 100);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

// Storage helpers
const GUEST_TOKEN_KEY = 'mapple_guest_token';
const AUTH_TOKEN_KEY = 'mapple_auth_token';

export function getGuestToken(): string {
  let token = localStorage.getItem(GUEST_TOKEN_KEY);
  if (!token) {
    token = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(GUEST_TOKEN_KEY, token);
  }
  return token;
}

export function setGuestToken(token: string): void {
  localStorage.setItem(GUEST_TOKEN_KEY, token);
}

export function removeGuestToken(): void {
  localStorage.removeItem(GUEST_TOKEN_KEY);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
