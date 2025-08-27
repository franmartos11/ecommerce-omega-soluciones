"use client";

import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

export async function signUpEmail({
  email,
  password,
  displayName,
}: { email: string; password: string; displayName?: string }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

export async function signInEmail({
  email,
  password,
}: { email: string; password: string }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOut() {
  await fbSignOut(auth);
}

export async function sendResetEmail(email: string, continueUrl: string) {
    // Firebase va a redirigir a esta URL con ?oobCode=...
    await sendPasswordResetEmail(auth, email, {
      url: continueUrl,
      handleCodeInApp: true,
    });
  }
  
  export async function verifyResetCode(oobCode: string) {
    // Devuelve el email asociado al código si es válido
    return await verifyPasswordResetCode(auth, oobCode);
  }
  
  export async function confirmReset(oobCode: string, newPassword: string) {
    // Cambia la contraseña
    await confirmPasswordReset(auth, oobCode, newPassword);
  }

export type { User };
  export { auth };

