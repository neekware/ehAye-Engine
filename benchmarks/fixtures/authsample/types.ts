/**
 * Shared types for the auth sample fixture (Suite D).
 * Pure TypeScript, no runtime deps.
 */

export type AuthState =
  | 'Anonymous'
  | 'CredentialsEntered'
  | 'Authenticating'
  | 'Authenticated'
  | 'MFARequired'
  | 'Locked'
  | 'SessionExpired'
  | 'Error';

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthResult {
  state: AuthState;
  token?: string;
  sessionId?: string;
  mfaToken?: string;
  error?: string;
  attemptsLeft?: number;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: number;
  token: string;
}
