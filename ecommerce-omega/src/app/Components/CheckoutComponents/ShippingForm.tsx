'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

export type ShippingData = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
};

interface Props {
  onNext: (data: ShippingData) => void;
}

export default function ShippingForm({ onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingData>({ mode: 'onBlur' });

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      className="bg-white p-6 rounded-md shadow-md space-y-6"
    >
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName', {
              required: 'Nombre obligatorio',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              maxLength: { value: 30, message: 'Máximo 30 caracteres' },
            })}
            className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bg1"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            id="lastName"
            type="text"
            {...register('lastName', {
              required: 'Apellido obligatorio',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              maxLength: { value: 30, message: 'Máximo 30 caracteres' },
            })}
            className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bg1"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Dirección */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          id="address"
          type="text"
          {...register('address', {
            required: 'Dirección obligatoria',
            minLength: { value: 5, message: 'Mínimo 5 caracteres' },
          })}
          className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bg1"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
      </div>

      {/* Ciudad, Provincia, Código Postal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <input
            id="city"
            type="text"
            {...register('city', { required: 'Ciudad obligatoria' })}
            className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bg1"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
            Provincia
          </label>
          <input
            id="province"
            type="text"
            {...register('province', { required: 'Provincia obligatoria' })}
            className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bg1"
          />
          {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>}
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código Postal
          </label>
          <input
            id="postalCode"
            type="text"
            {...register('postalCode', {
              required: 'Código postal obligatorio',
              pattern: { value: /^[0-9]{4,10}$/, message: 'Formato inválido' },
            })}
            className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bg1"
          />
          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
        </div>
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone', {
            required: 'Teléfono obligatorio',
            pattern: { value: /^\+?\d{7,15}$/, message: 'Número inválido' },
          })}
          className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bg1"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      {/* Botón Continuar */}
      <button
        type="submit"
        className=" cursor-pointer w-full bg-bg1 hover:bg-bg2 text-white font-medium py-2 rounded-md transition"
      >
        Continuar
      </button>
    </form>
  );
}
