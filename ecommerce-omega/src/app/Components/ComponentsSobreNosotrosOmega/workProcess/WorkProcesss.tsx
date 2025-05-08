"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const WorkProcess = () => {
  const steps = [
    { title: "NOS CONTACTAS", icon: "/SobreNosotros/phone.png" },
    { title: "ANÁLISIS Y PRESUPUESTO", icon: "/SobreNosotros/lupa.png" },
    { title: "NOS APROBÁS", icon: "/SobreNosotros/management-icon.png" },
    { title: "GESTIÓN Y SEGUIMIENTO", icon: "/SobreNosotros/tracking-icon.png" },
    { title: "FINALIZACIÓN CON GARANTÍA", icon: "/SobreNosotros/contrato.png" },
  ];

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: index * 0.3,
      },
    }),
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className=" bg-no-repeat bg-cover bg-center min-h-screen pt-[5rem] py-20 px-6 text-center"
    >
      {/* Header */}
      <div className="container px-6 mx-auto mb-[5rem] sm:mb-[8rem]">
        <h2 className="text-4xl text-black font-semibold capitalize lg:text-6xl">
          FORMA DE TRABAJO
        </h2>
        <div className="flex justify-center mx-auto mt-6">
          <span className="inline-block w-40 h-1 bg-orange-500 rounded-full"></span>
          <span className="inline-block w-3 h-1 mx-1 bg-orange-500 rounded-full"></span>
          <span className="inline-block w-1 h-1 bg-orange-500 rounded-full"></span>
        </div>
      </div>

      {/* Steps Section */}
      <div className="pt-[5rem] flex flex-wrap justify-center items-center gap-x-16 gap-y-16">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={`relative flex flex-col items-center ${
              index % 2 === 0 ? "lg:mt-[-5rem]" : "lg:mt-[5rem]"
            }`}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={stepVariants}
            custom={index}
          >
            {/* Icon Container */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center w-[7rem] h-[7rem] sm:w-[10rem] sm:h-[10rem] bg-white rounded-full shadow-lg border-4 border-orange-500"
            >
              <img
                src={step.icon}
                alt={step.title}
                className="w-[3rem] h-[3rem] sm:w-[6rem] sm:h-[6rem] object-contain"
              />
            </motion.div>
            {/* Step Title */}
            <p className="mt-4 text-lg font-bold text-black text-center sm:text-xl">
              {step.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WorkProcess;
