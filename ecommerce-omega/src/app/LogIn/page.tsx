'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string): boolean =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'El correo no es válido';
    }

    if (!validatePassword(password)) {
      newErrors.password =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo';
    }

    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;

    console.log({ email, password, remember });
    // 🔐 Aquí iría fetch/axios al backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Correo electrónico"
              className={`pl-10 w-full border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
                errors.email ? 'ring-red-400' : 'ring-green-400'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Contraseña"
              className={`pl-10 w-full border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
                errors.password ? 'ring-red-400' : 'ring-green-400'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Recordarme + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-green-500"
              />
              Recordarme
            </label>
            <Link href="#" className="text-green-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={!formValid}
            className={`w-full text-white py-2 rounded-md transition ${
              formValid
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Ingresar
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          ¿No tenés cuenta?{' '}
          <Link href="/Registro" className="text-green-600 hover:underline font-medium">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
