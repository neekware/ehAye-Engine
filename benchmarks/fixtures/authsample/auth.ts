/**
 * auth.ts — small login / auth module for Suite D benchmarks.
 *
 * Original generic sample code. No product IP, no real secrets.
 * States and transitions are intentional and discoverable from this file alone.
 */
import type { AuthResult, AuthState, Credentials, Session } from './types';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

interface InternalState {
  current: AuthState;
  attempts: number;
  lockedUntil: number | null;
  session: Session | null;
  lastError: string | null;
}

let state: InternalState = {
  current: 'Anonymous',
  attempts: 0,
  lockedUntil: null,
  session: null,
  lastError: null,
};

function validateCredentials(creds: Credentials): string | null {
  if (!creds.username || creds.username.length < 3) return 'Invalid username';
  if (!creds.password || creds.password.length < 8) return 'Invalid password';
  return null;
}

function isLocked(): boolean {
  if (!state.lockedUntil) return false;
  if (Date.now() > state.lockedUntil) {
    state.lockedUntil = null;
    state.attempts = 0;
    return false;
  }
  return true;
}

/** Move Anonymous → CredentialsEntered after local validation. */
export function enterCredentials(creds: Credentials): AuthResult {
  if (state.current === 'Locked' || isLocked()) {
    return { state: 'Locked', error: 'Account locked' };
  }

  const validationError = validateCredentials(creds);
  if (validationError) {
    state.lastError = validationError;
    return { state: 'Error', error: validationError };
  }

  state.current = 'CredentialsEntered';
  state.lastError = null;
  return { state: 'CredentialsEntered' };
}

/**
 * Full authenticate path:
 * CredentialsEntered/Anonymous → Authenticating →
 *   Authenticated | MFARequired | Error | Locked
 */
export async function authenticate(creds: Credentials): Promise<AuthResult> {
  if (state.current === 'Locked' || isLocked()) {
    return { state: 'Locked', error: 'Account locked' };
  }

  const validationError = validateCredentials(creds);
  if (validationError) {
    state.lastError = validationError;
    return { state: 'Error', error: validationError };
  }

  state.current = 'Authenticating';
  state.attempts += 1;

  // Simulated network / identity-provider round-trip
  await new Promise((r) => setTimeout(r, 120));

  // Demo-only hardcoded accounts (generic sample, not real secrets)
  if (creds.username === 'lockeduser') {
    state.current = 'Locked';
    state.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    return { state: 'Locked', error: 'Too many failed attempts' };
  }

  if (creds.password === 'wrongpass' || state.attempts > MAX_ATTEMPTS) {
    if (state.attempts >= MAX_ATTEMPTS) {
      state.current = 'Locked';
      state.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      return { state: 'Locked', error: 'Account locked after too many attempts' };
    }
    state.current = 'Error';
    state.lastError = 'Invalid credentials';
    return {
      state: 'Error',
      error: 'Invalid credentials',
      attemptsLeft: MAX_ATTEMPTS - state.attempts,
    };
  }

  if (creds.username === 'mfauser') {
    state.current = 'MFARequired';
    return { state: 'MFARequired', mfaToken: 'mfa-' + Date.now() };
  }

  const session: Session = {
    id: 'sess-' + Date.now(),
    userId: creds.username,
    expiresAt: Date.now() + SESSION_DURATION_MS,
    token: 'tok-' + Math.random().toString(36).slice(2),
  };

  state.current = 'Authenticated';
  state.session = session;
  state.attempts = 0;

  return {
    state: 'Authenticated',
    token: session.token,
    sessionId: session.id,
  };
}

/** MFARequired → Authenticated | Error */
export function verifyMFA(mfaCode: string, _mfaToken: string): AuthResult {
  if (state.current !== 'MFARequired') {
    return { state: state.current, error: 'Invalid state for MFA' };
  }
  if (mfaCode === '123456') {
    const session: Session = {
      id: 'sess-mfa-' + Date.now(),
      userId: 'mfauser',
      expiresAt: Date.now() + SESSION_DURATION_MS,
      token: 'tok-mfa-' + Math.random().toString(36).slice(2),
    };
    state.current = 'Authenticated';
    state.session = session;
    return { state: 'Authenticated', token: session.token, sessionId: session.id };
  }
  state.current = 'Error';
  return { state: 'Error', error: 'Invalid MFA code' };
}

export function getCurrentState(): AuthState {
  if (isLocked()) return 'Locked';
  return state.current;
}

export function logout(): void {
  state = {
    current: 'Anonymous',
    attempts: 0,
    lockedUntil: null,
    session: null,
    lastError: null,
  };
}

/** Returns null and flips state to SessionExpired when past expiresAt. */
export function getSession(): Session | null {
  if (state.session && Date.now() > state.session.expiresAt) {
    state.current = 'SessionExpired';
    return null;
  }
  return state.session;
}
