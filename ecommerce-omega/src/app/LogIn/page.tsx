'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [submitted, email, password]);

  const validateEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validatePassword = (value: string): boolean =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'El correo no es válido';
    }
    if (!validatePassword(password)) {
      newErrors.password =
        'Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      // Mock de validación de API
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.ok || email === 'test@omega.com') {
        localStorage.setItem('userLoggedIn', JSON.stringify({ email, remember }));
        router.push('/');
      } else {
        throw new Error();
      }
    } catch {
      setErrors(prev => ({ ...prev, api: 'Credenciales incorrectas' }));
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-bg2 px-4"
    >
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-10">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-4" />
        <h1 className="text-black text-4xl font-bold">LOGO</h1>
      </div>

      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white shadow-md rounded-xl p-8 lg:mr-20"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="example@omega.com"
            className={`w-full text-black border ${
              submitted && errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
              submitted && errors.email ? 'ring-red-400' : 'ring-text1'
            }`}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {submitted && errors.email && (
            <p className="text-xs text-red-500 -mt-4">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="••••••••"
            className={`w-full text-black border ${
              submitted && errors.password ? 'border-red-500' : 'border-gray-300'
            } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
              submitted && errors.password ? 'ring-red-400' : 'ring-text1'
            }`}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {submitted && errors.password && (
            <p className="text-xs text-red-500 -mt-4">{errors.password}</p>
          )}

          {errors.api && <p className="text-sm text-red-500">{errors.api}</p>}

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-gray-500">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-text1"
              />
              Recordarme
            </label>
            <Link href="Contrasena" className="text-gray-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full text-white py-2 rounded-md transition bg-bg1 hover:bg-bg2"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-500">
          ¿No tenés cuenta?{' '}
          <Link
            href="/Registro"
            className="text-text1 hover:underline font-medium"
          >
            Registrate
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
