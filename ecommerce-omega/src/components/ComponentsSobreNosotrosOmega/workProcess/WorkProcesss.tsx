"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";
import type { Config, WorkProcessConfig, WorkProcessStep } from "@/lib/config.types";

const WorkProcess: React.FC = () => {
  // ✅ tu hook devuelve el Config directo
  const config: Config = useConfig();

  // Fallback seguro + override desde JSON
  const cfg: WorkProcessConfig = {
    sectionId: "workprocess",
    backgroundImage: undefined,
    heading: "FORMA DE TRABAJO",
    accentColorClass: "bg-orange-500",
    textColorClass: "text-black",
    staggerMs: 300,
    durationMs: 1000,
    steps: [
      // vacío por si no cargó el JSON aún
    ],
    ...(config?.home?.workProcess ?? {}),
  };

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: (cfg.durationMs ?? 1000) / 1000,
        ease: "easeOut",
        delay: (cfg.staggerMs ?? 300) * index / 1000,
      },
    }),
  };

  const bgStyle = cfg.backgroundImage ? { backgroundImage: `url('${cfg.backgroundImage}')` } : undefined;

  return (
    <section
      id={cfg.sectionId ?? "workprocess"}
      ref={ref}
      className="bg-no-repeat bg-cover bg-center min-h-screen pt-[5rem] py-20 px-6 text-center"
      style={bgStyle}
    >
      {/* Header */}
      <div className="container px-6 mx-auto mb-[5rem] sm:mb-[8rem]">
        <h2 className={`text-4xl ${cfg.textColorClass ?? "text-black"} font-semibold capitalize lg:text-6xl`}>
          {cfg.heading ?? "FORMA DE TRABAJO"}
        </h2>
        <div className="flex justify-center mx-auto mt-6">
          <span className={`inline-block w-40 h-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`}></span>
          <span className={`inline-block w-3 h-1 mx-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`}></span>
          <span className={`inline-block w-1 h-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`}></span>
        </div>
      </div>

      {/* Steps */}
      <div className="pt-[5rem] flex flex-wrap justify-center items-center gap-x-16 gap-y-16">
        {(cfg.steps ?? []).map((step: WorkProcessStep, index: number) => {
          const content = (
            <>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex items-center justify-center w-[7rem] h-[7rem] sm:w-[10rem] sm:h-[10rem] bg-white rounded-full shadow-lg border-4 ${
                  (cfg.accentColorClass ?? "bg-orange-500").replace("bg-", "border-")
                }`}
              >
                <img
                  src={step.icon}
                  alt={step.title}
                  className="w-[3rem] h-[3rem] sm:w-[6rem] sm:h-[6rem] object-contain"
                />
              </motion.div>
              <p className={`mt-4 text-lg font-bold ${cfg.textColorClass ?? "text-black"} text-center sm:text-xl`}>
                {step.title}
              </p>
              {step.description && (
                <p className="mt-1 text-sm text-gray-600 max-w-[14rem]">{step.description}</p>
              )}
            </>
          );

          return (
            <motion.div
              key={`${step.title}-${index}`}
              className={`relative flex flex-col items-center ${
                index % 2 === 0 ? "lg:mt-[-5rem]" : "lg:mt-[5rem]"
              }`}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={stepVariants}
              custom={index}
            >
              {step.href ? (
                <a href={step.href} className="group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 rounded-full">
                  {content}
                </a>
              ) : (
                content
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WorkProcess;
