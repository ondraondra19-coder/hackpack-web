// lib/accounts.ts
// Dílčí (ne-hlavní) admin účty. Hlavní účet (Ondřej Kubrický / ADMIN_SECRET)
// se sem NEUKLÁDÁ — je to pevně zadrátovaný speciální případ řešený v lib/adminAuth.ts.
import { randomBytes, randomUUID, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { getRedis } from "./redis";
import type { Permission } from "./permissions";

const scrypt = promisify(scryptCb);

const LIST_KEY = "accounts:list";

export type Account = {
  id: string;
  name: string; // slouží zároveň jako přihlašovací jméno
  passwordHash: string; // formát "salt:hash" (hex) — nikdy se nevrací klientovi
  permissions: Permission[];
  createdAt: string;
};

// ── Veřejný tvar účtu — bez hashe hesla ─────────────────────────────────────
export type PublicAccount = Omit<Account, "passwordHash">;

export function toPublicAccount(account: Account): PublicAccount {
  const { passwordHash, ...rest } = account;
  return rest;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPasswordHash(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const storedBuf = Buffer.from(hashHex, "hex");
  if (derived.length !== storedBuf.length) return false;

  return timingSafeEqual(derived, storedBuf);
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

// ── Čtení všech dílčích účtů ─────────────────────────────────────────────────
export async function getAllAccounts(): Promise<Account[]> {
  const redis = getRedis();
  const raw = await redis.lrange<string>(LIST_KEY, 0, -1);

  const accounts: Account[] = [];
  for (const item of raw) {
    try {
      const parsed: Account = typeof item === "string" ? JSON.parse(item) : (item as unknown as Account);
      accounts.push(parsed);
    } catch {
      // Poškozenou položku tiše přeskočíme.
    }
  }
  return accounts;
}

export async function findAccountByName(name: string): Promise<Account | null> {
  const accounts = await getAllAccounts();
  const target = normalizeName(name);
  return accounts.find((a) => normalizeName(a.name) === target) ?? null;
}

export async function findAccountById(id: string): Promise<Account | null> {
  const accounts = await getAllAccounts();
  return accounts.find((a) => a.id === id) ?? null;
}

// ── Vytvoření nového účtu ────────────────────────────────────────────────────
export type NewAccountInput = {
  name: string;
  password: string;
  permissions: Permission[];
};

export async function addAccount(input: NewAccountInput): Promise<Account> {
  const redis = getRedis();

  const account: Account = {
    id: randomUUID(),
    name: input.name.trim(),
    passwordHash: await hashPassword(input.password),
    permissions: input.permissions,
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(LIST_KEY, JSON.stringify(account));
  return account;
}

// ── Úprava oprávnění existujícího účtu ───────────────────────────────────────
export async function updateAccountPermissions(
  id: string,
  permissions: Permission[]
): Promise<boolean> {
  const redis = getRedis();
  const raw = await redis.lrange<string>(LIST_KEY, 0, -1);

  const updated: string[] = [];
  let found = false;

  for (const item of raw) {
    try {
      const parsed: Account = typeof item === "string" ? JSON.parse(item) : (item as unknown as Account);
      if (parsed.id === id) {
        parsed.permissions = permissions;
        found = true;
      }
      updated.push(JSON.stringify(parsed));
    } catch {
      updated.push(item as unknown as string);
    }
  }

  if (!found) return false;

  await redis.del(LIST_KEY);
  if (updated.length > 0) {
    await redis.rpush(LIST_KEY, ...updated);
  }
  return true;
}

// ── Smazání účtu ─────────────────────────────────────────────────────────────
export async function deleteAccount(id: string): Promise<boolean> {
  const redis = getRedis();
  const raw = await redis.lrange<string>(LIST_KEY, 0, -1);

  const remaining: string[] = [];
  let found = false;

  for (const item of raw) {
    try {
      const parsed: Account = typeof item === "string" ? JSON.parse(item) : (item as unknown as Account);
      if (parsed.id === id) {
        found = true;
        continue; // vynecháme mazaný účet
      }
      remaining.push(typeof item === "string" ? item : JSON.stringify(parsed));
    } catch {
      remaining.push(item as unknown as string);
    }
  }

  if (!found) return false;

  await redis.del(LIST_KEY);
  if (remaining.length > 0) {
    await redis.rpush(LIST_KEY, ...remaining);
  }
  return true;
}

// ── Ověření přihlašovacích údajů dílčího účtu (hlavní účet řeší jinde) ──────
export async function verifyAccountPassword(name: string, password: string): Promise<Account | null> {
  const account = await findAccountByName(name);
  if (!account) return null;

  const ok = await verifyPasswordHash(password, account.passwordHash);
  return ok ? account : null;
}