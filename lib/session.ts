// lib/session.ts
// Zjistí, kdo je právě přihlášený (podle cookie) a jaká má oprávnění.
// Používá se jak v app/admin/page.tsx, tak v API routách, které musí
// kontrolovat oprávnění, ne jen "je někdo přihlášený".
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifySessionToken, MAIN_ACCOUNT_ID, MAIN_ACCOUNT_NAME } from "./adminAuth";
import { findAccountById } from "./accounts";
import { GRANTABLE_PERMISSIONS, type Permission } from "./permissions";

export type CurrentSession = {
  accountId: string;
  name: string;
  isMain: boolean;
  // Hlavní účet má implicitně všechna oprávnění, i "Správu účtů" navíc (ta tu není,
  // protože není grantovatelná — kontroluje se zvlášť přes isMain).
  permissions: Permission[];
};

export async function getCurrentSession(): Promise<CurrentSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session) return null;

  if (session.accountId === MAIN_ACCOUNT_ID) {
    return {
      accountId: MAIN_ACCOUNT_ID,
      name: MAIN_ACCOUNT_NAME,
      isMain: true,
      permissions: [...GRANTABLE_PERMISSIONS],
    };
  }

  const account = await findAccountById(session.accountId);
  if (!account) return null; // účet byl mezitím smazán, token už neplatí

  return {
    accountId: account.id,
    name: account.name,
    isMain: false,
    permissions: account.permissions,
  };
}