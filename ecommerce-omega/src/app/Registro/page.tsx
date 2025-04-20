'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formValid, setFormValid] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  useEffect(() => {
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

    if (!form.termsAccepted) {
      newErrors.termsAccepted = 'Debés aceptar los términos';
    }

    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0);
  }, [form]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;

    console.log('🔐 Registrando:', form);
    // Aquí va fetch o axios para enviar al backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nombre completo"
              className={`pl-10 w-full border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
                errors.name ? 'ring-red-400' : 'ring-green-400'
              }`}
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

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
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
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
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className={`pl-10 w-full border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
                errors.confirmPassword ? 'ring-red-400' : 'ring-green-400'
              }`}
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Términos */}
          <div className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => handleChange('termsAccepted', e.target.checked)}
              className="accent-green-500"
              required
            />
            <span>
              Acepto los{' '}
              <Link href="/terminos" className="text-green-600 hover:underline">
                términos y condiciones
              </Link>
            </span>
          </div>
          {errors.termsAccepted && (
            <p className="text-xs text-red-500 -mt-3">{errors.termsAccepted}</p>
          )}

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
            Registrarme
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-green-600 hover:underline font-medium">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
