"use client";

import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  sendEmailVerification,
  type User,
} from "firebase/auth";
import {
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// 👉 Crear usuario en Firebase + perfil en Firestore
export async function signUpEmail({
  email,
  password,
  displayName,
  createProfileDoc = true,
}: {
  email: string;
  password: string;
  displayName?: string;
  createProfileDoc?: boolean;
}): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }

  // Enviar verificación de email (opcional, recomendado)
  await sendEmailVerification(cred.user);

  // Crear documento en Firestore con datos básicos
  if (createProfileDoc && db) {
    const ref = doc(db, "users", cred.user.uid);
    await setDoc(ref, {
      email,
      displayName: cred.user.displayName ?? null,
      createdAt: serverTimestamp(),
      role: "user",
      status: "active",
    });
  }

  return cred.user;
}

// 👉 Iniciar sesión
export async function signInEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// 👉 Cerrar sesión
export async function signOut() {
  await fbSignOut(auth);
}

// 👉 Enviar email de recuperación de contraseña
export async function sendResetEmail(email: string, continueUrl: string) {
  await sendPasswordResetEmail(auth, email, {
    url: continueUrl,          // redirige a /reset-password?oobCode=...
    handleCodeInApp: true,
  });
}

// 👉 Verificar código de recuperación
export async function verifyResetCode(oobCode: string) {
  return await verifyPasswordResetCode(auth, oobCode);
}

// 👉 Confirmar nueva contraseña
export async function confirmReset(oobCode: string, newPassword: string) {
  await confirmPasswordReset(auth, oobCode, newPassword);
}

export type { User };
export { auth, db };
