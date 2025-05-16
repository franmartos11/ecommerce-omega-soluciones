"use client";

import React from "react";
import { useForm } from "react-hook-form";

export type PaymentData = {
  method: "local" | "transfer" | "mercadopago";
  transferReference?: string;
};
interface Props {
  onNext: (method: PaymentData["method"]) => void;
}

export default function PaymentForm({ onNext }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentData>({ defaultValues: { method: "mercadopago" } });

  const selectedMethod = watch("method");

  const onSubmit = (data: PaymentData) => {
    onNext(data.method);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-md shadow-md space-y-6"
    >
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-gray-700">
          Seleccione método de pago
        </legend>

        <div className="flex items-center">
          <input
            type="radio"
            id="mercadopago"
            value="mercadopago"
            {...register("method", { required: true })}
            className="h-4 w-4 text-bg1 focus:ring-bg1 border-gray-300"
          />
          <label
            htmlFor="mercadopago"
            className="ml-2 block text-sm text-gray-700"
          >
            MercadoPago
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="local"
            value="local"
            {...register("method", { required: true })}
            className="h-4 w-4 text-bg1 focus:ring-bg1 border-gray-300"
          />
          <label htmlFor="local" className="ml-2 block text-sm text-gray-700">
            Pagar en local
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="transfer"
            value="transfer"
            {...register("method", { required: true })}
            className="h-4 w-4 text-bg1 focus:ring-bg1 border-gray-300"
          />
          <label
            htmlFor="transfer"
            className="ml-2 block text-sm text-gray-700"
          >
            Transferencia bancaria
          </label>
        </div>

        {errors.method && (
          <p className="text-red-500 text-sm">Seleccione un método</p>
        )}
      </fieldset>

      {selectedMethod === "transfer" && (
        <div>
          <label
            htmlFor="transferReference"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Referencia de transferencia
          </label>
          <input
            id="transferReference"
            type="text"
            {...register("transferReference", {
              required: "Referencia obligatoria",
              minLength: { value: 5, message: "Mínimo 5 caracteres" },
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bg1"
          />
          {errors.transferReference && (
            <p className="text-red-500 text-sm mt-1">
              {errors.transferReference.message}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        className=" cursor-pointer w-full bg-bg1 hover:bg-bg2 text-white font-medium py-2 rounded-md transition"
      >
        Continuar
      </button>
    </form>
  );
}
