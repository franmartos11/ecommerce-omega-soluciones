import React from 'react';

interface StepperProps {
  step: number;
}

// Componente visual para mostrar el avance del checkout en 3 pasos
export default function CheckoutStepper({ step }: StepperProps) {
  const labels = ['Envío', 'Pago', 'Resumen'];

  return (
    <div className="flex justify-between mb-8">
      {labels.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= step;

        return (
          <div key={label} className="flex-1 text-center">
            <div
              className={`mx-auto w-8 h-8 rounded-full border-2 flex items-center justify-center
                ${isActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'}`.replace(/\s+/g, ' ')}
            >
              <span className={`font-semibold ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{stepNumber}</span>
            </div>
            <p className={`mt-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{label}</p>
          </div>
        );
      })}
    </div>
  );
}
