"use client";

import { supabase } from "./client";
import type { User } from "@supabase/supabase-js";

// 👉 Crear usuario en Supabase Auth + perfil en la tabla users (PostgreSQL)
export async function signUpEmail({
  email,
  password,
  displayName,
}: {
  email: string;
  password: string;
  displayName?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) throw error;
  
  return data.user;
}

// 👉 Iniciar sesión
export async function signInEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
}

// 👉 Cerrar sesión
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 👉 Iniciar sesión con Google (OAuth)
export async function signInWithGoogle() {
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "/auth/callback";

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) throw error;
}


// 👉 Enviar email de recuperación de contraseña
export async function sendResetEmail(email: string, continueUrl: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: continueUrl,
  });
  
  if (error) throw error;
}

// 👉 Supabase no usa `verifyResetCode` ni maneja `oobCode` manualmente de la misma manera
// El link del email ya loguea al usuario temporalmente o lo lleva a un prompt especial.
// Solo necesitas actualizar el password si el usuario fue redirigido por el email.
export async function confirmReset(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
}

export type { User };
