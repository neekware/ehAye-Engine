# Auth sample fixture (Suite D)

Small, self-contained TypeScript login/auth module used by:

- **D1** — reverse-engineer the state machine from code
- **D2** — show the login → authentication call flow

## Files

| File       | Purpose                                      |
| ---------- | -------------------------------------------- |
| `types.ts` | Shared state / credential / session types    |
| `auth.ts`  | Core state machine + login / MFA / session   |
| `README.md`| This note                                    |

## How to run

No build step. Any TypeScript runner works, for example:

```bash
npx tsx -e "import { authenticate } from './auth.ts'; console.log(await authenticate({ username: 'alice', password: 'password1' }))"
```

## What models should see

Point the model at this folder only. Do **not** hand over sealed answer keys.
The model must read the code and produce:

1. A state machine (states + transitions) that matches the code.
2. A flowchart of the login / authenticate path (including error, lockout, MFA).

## Design notes (public)

- Pure TypeScript, zero dependencies.
- States are explicit string unions in `types.ts`.
- Transitions are all in `auth.ts` (`enterCredentials`, `authenticate`, `verifyMFA`, `getSession`, `logout`).
- Demo accounts (`mfauser`, `lockeduser`, password `wrongpass`, MFA code `123456`) are intentional sample data — not production secrets.
