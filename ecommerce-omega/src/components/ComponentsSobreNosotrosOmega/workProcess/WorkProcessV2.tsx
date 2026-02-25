"use client";

import React from "react";
import { motion } from "framer-motion";

const WorkProcess = () => {
  const steps = [
    {title: "Nos Contactas", icon:"/SobreNosotros/phone.png"},
    { title: "Análisis y Presupuesto", icon: "/SobreNosotros/lupa.png" },
    { title: "Nos Aprobas", icon: "/SobreNosotros/management-icon.png" },
    { title: "Gestion Y Seguimiento", icon: "/SobreNosotros/tracking-icon.png" },
    { title: "Finalizacion Con Garantia", icon: "/SobreNosotros/contrato.png" },
  ];

  const stepVariants = {
    hidden: {
      opacity: 0,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: index * 0.2,
      },
    }),
  };

  return (
    <section className=" bg-no-repeat bg-cover bg-center h-auto pt-10 pb-10 px-4 text-center ">
      <div className="container mx-auto">
        {/* Título */}
        <h2 className="text-3xl text-white font-semibold capitalize sm:text-4xl">
          FORMA DE TRABAJO
        </h2>
        <div className="flex justify-center mt-4">
          <span className="inline-block w-32 h-1 bg-orange-500 rounded-full"></span>
          <span className="inline-block w-2 h-1 mx-1 bg-orange-500 rounded-full"></span>
          <span className="inline-block w-1 h-1 bg-orange-500 rounded-full"></span>
        </div>
      </div>

      {/* Pasos siempre alineados */}
      <div className="relative flex justify-center items-center gap-4 mt-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            custom={index}
            initial="hidden"
            animate="visible"
            variants={stepVariants}
          >
            {/* Círculos Responsivos */}
            <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 bg-white rounded-full shadow-md border-2 md:border-4 border-orange-500">
              <img
                src={step.icon}
                alt={step.title}
                className="w-[1.5rem] h-[1.5rem] md:w-[2rem] md:h-[2rem] object-contain"
              />
            </div>
            {/* Título */}
            <p className="mt-2 text-xs lg:text-xs  text-white">
              {step.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WorkProcess;

