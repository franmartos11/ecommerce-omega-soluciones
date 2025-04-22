'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-green-400 px-4"
    >
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-10">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-4" />
        <h1 className="text-white text-4xl font-bold">LOGO</h1>
      </div>

      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8 lg:mr-20">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="example@spectra.com"
            className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${errors.email ? 'ring-red-400' : 'ring-green-400'}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="text-xs text-red-500 -mt-4">{errors.email}</p>}

          <input
            type="password"
            placeholder="••••••••"
            className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${errors.password ? 'ring-red-400' : 'ring-green-400'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="text-xs text-red-500 -mt-4">{errors.password}</p>}

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-green-500"
              />
              Stay signed in
            </label>
            <Link href="#" className="text-gray-500 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!formValid}
            className={`w-full text-white py-2 rounded-md transition ${formValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Iniciar Sesion
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/Registro" className="text-green-600 hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="my-4 border-t text-center relative">
          <span className="absolute bg-white px-2 text-gray-400 -top-3 left-1/2 transform -translate-x-1/2 text-sm">
            OR
          </span>
        </div>

        <div className="space-y-3">
          <button className="w-full border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <Image src="/google-icon.svg" alt="Google" width={18} height={18} />
            Continue with Google
          </button>
          <button className="w-full border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <Image src="/facebook-icon.svg" alt="Facebook" width={18} height={18} />
            Continue with Facebook
          </button>
          <button className="w-full border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <Image src="/apple-icon.svg" alt="Apple" width={18} height={18} />
            Continue with Apple
          </button>
        </div>

        <p className="text-[11px] text-gray-500 text-center mt-4">
          By clicking Sign in, Continue with Google, Facebook, or Apple, you agree to Omega{' '}
          <Link href="#" className="underline">
            Terms of Use
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline">
            Privacy Policy
          </Link>
          .
        </p>

        <p className="text-[11px] text-gray-500 text-center mt-2">
          Spectra may send you communications; you may change your preferences in your account
          settings. We'll never post without your permission.
        </p>
      </div>
    </motion.div>
  );
}
