'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { signUpEmail } from '../lib/firebase/auth-clients'; 

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Si preferís mínimo 6, cambiá por: /.{6,}/
  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!validateEmail(form.email)) newErrors.email = 'Correo inválido';
    if (!validatePassword(form.password)) {
      newErrors.password =
        'Debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!form.termsAccepted) newErrors.termsAccepted = 'Debés aceptar los términos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Revalida en cada cambio tras el primer submit
  useEffect(() => {
    if (submitted) validateForm();
  }, [form, submitted]);

  const handleChange = (
    field: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Crea el usuario en Firebase Auth y (opcional) el doc en Firestore
      await signUpEmail({
        email: form.email,
        password: form.password,
        displayName: form.name,
        createProfileDoc: true, // deja en true si querés /users/{uid}
      });

      // Redirige al login (o al dashboard si preferís)
      router.push('/LogIn');
    } catch (error: unknown) {
      const code = error instanceof FirebaseError ? error.code : undefined;

      if (code === 'auth/email-already-in-use') {
        setErrors({ api: 'Ese email ya está registrado.' });
      } else if (code === 'auth/invalid-email') {
        setErrors({ api: 'Email inválido.' });
      } else if (code === 'auth/weak-password') {
        setErrors({ api: 'Contraseña demasiado débil.' });
      } else {
        router.push('/LogIn');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-400 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Crear Cuenta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
              <input
                type="text"
                placeholder="Nombre completo"
                className={`pl-10 text-gray-600 w-full border ${
                  submitted && errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
                  submitted && errors.name ? 'ring-red-400' : 'ring-green-400'
                }`}
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            {submitted && errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
              <input
                type="email"
                placeholder="Correo electrónico"
                className={`pl-10 text-gray-600 w-full border ${
                  submitted && errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
                  submitted && errors.email ? 'ring-red-400' : 'ring-green-400'
                }`}
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            {submitted && errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
              <input
                type="password"
                placeholder="Contraseña"
                className={`pl-10 text-gray-600 w-full border ${
                  submitted && errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
                  submitted && errors.password ? 'ring-red-400' : 'ring-green-400'
                }`}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>
            {submitted && errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                className={`pl-10 text-gray-600 w-full border ${
                  submitted && errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
                  submitted && errors.confirmPassword
                    ? 'ring-red-400'
                    : 'ring-green-400'
                }`}
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
              />
            </div>
            {submitted && errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Términos */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => handleChange('termsAccepted', e.target.checked)}
              className="accent-green-500"
            />
            <span>
              Acepto los{' '}
              <Link href="/terminos" className="text-green-600 hover:underline">
                términos y condiciones
              </Link>
            </span>
          </div>
          {submitted && errors.termsAccepted && (
            <p className="text-xs text-red-500 -mt-3">
              {errors.termsAccepted}
            </p>
          )}

          {/* Error API */}
          {submitted && errors.api && (
            <p className="text-sm text-red-500">{errors.api}</p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link
            href="/LogIn"
            className="text-green-600 hover:underline font-medium"
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
