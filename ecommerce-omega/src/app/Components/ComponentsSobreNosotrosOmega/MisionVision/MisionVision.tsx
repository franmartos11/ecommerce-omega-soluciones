"use client";

import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";
import type { Config, MisionVisionConfig } from "@/lib/config.types";

const MisionVision = () => {
  // ✅ tu hook devuelve el Config directo
  const config: Config = useConfig();

  const cfg: MisionVisionConfig = {
    sectionId: "nosotros",
    backgroundImage: undefined,
    heading: "NOSOTROS",
    introTitle:
      "Desde 2019 que ayudamos a nuestros clientes en proyectos públicos y privados.",
    introSubtitle:
      "Enfrentamos todo tipo de desafíos: soporte en inundaciones, sequías, proyectos mineros, campamentos, oficinas, colegios, hospitales, nuevos emprendimientos y más.",
    mission: {
      title: "Nuestra Misión",
      text: "Solucionar los problemas de distinta índole de nuestros clientes, ofreciéndoles todo lo que requieran sin importar el tipo de producto o servicio.",
    },
    vision: {
      title: "Nuestra Visión",
      text: "Trabajar en conjunto con las empresas más grandes de la región y convertirnos así, en un aliado estratégico para su desarrollo.",
    },
    // 🔽 override con lo que venga del JSON
    ...(config?.home?.misionVision ?? {}),
  };

  const [missionRef, missionInView] = useInView({ triggerOnce: true });
  const [visionRef, visionInView] = useInView({ triggerOnce: true });

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.2,
      },
    }),
  };

  return (
    <section
      id={cfg.sectionId ?? "nosotros"}
      className="bg-no-repeat bg-cover bg-center min-h-screen flex flex-col justify-center items-center px-6 py-[3rem] lg:py-[0rem] overflow-hidden"
      style={
        cfg.backgroundImage
          ? { backgroundImage: `url('${cfg.backgroundImage}')` }
          : undefined
      }
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-center max-w-5xl mx-auto mb-[3rem] sm:mb-[7rem]"
      >
        <motion.h2
          variants={fadeInUp}
          custom={0}
          className="text-4xl text-black font-semibold capitalize lg:text-6xl"
        >
          {cfg.heading}
        </motion.h2>

        <motion.div
          variants={fadeInUp}
          custom={1}
          className="flex justify-center mt-4 mb-8"
        >
          <span className="inline-block w-20 h-1 bg-orange-500 rounded-full"></span>
          <span className="inline-block w-10 h-1 mx-1 bg-orange-500 rounded-full"></span>
          <span className="inline-block w-5 h-1 bg-orange-500 rounded-full"></span>
        </motion.div>

        {cfg.introTitle && (
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-4xl text-black font-bold mb-4"
          >
            {cfg.introTitle}
          </motion.p>
        )}

        {cfg.introSubtitle && (
          <motion.p
            variants={fadeInUp}
            custom={3}
            className="text-2xl text-gray-800 pt-[1rem]"
          >
            {cfg.introSubtitle}
          </motion.p>
        )}
      </motion.div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Misión */}
        <motion.div
          ref={missionRef}
          initial={{ opacity: 0, translateX: -50 }}
          animate={missionInView ? { opacity: 1, translateX: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col text-center "
        >
          <h2 className="text-3xl font-bold text-black uppercase mb-4">
            {cfg.mission?.title ?? "Nuestra Misión"}
          </h2>
          <div className="flex justify-center  mb-4">
            <span className="inline-block w-10 h-1 mx-1 bg-orange-500 rounded-full"></span>
            <span className="inline-block w-20 h-1 bg-orange-500 rounded-full"></span>
            <span className="inline-block w-10 h-1 mx-1 bg-orange-500 rounded-full"></span>
          </div>
          {cfg.mission?.text && (
            <p className="text-gray-800 text-2xl max-w-[35rem] mx-auto lg:mx-0 ">
              {cfg.mission.text}
            </p>
          )}
        </motion.div>

        {/* Visión */}
        <motion.div
          ref={visionRef}
          initial={{ opacity: 0, translateX: 50 }}
          animate={visionInView ? { opacity: 1, translateX: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="relative z-10 flex flex-col text-center "
        >
          <h2 className="text-3xl font-bold text-black uppercase mb-4">
            {cfg.vision?.title ?? "Nuestra Visión"}
          </h2>
          <div className="flex justify-center mb-4">
            <span className="inline-block w-10 h-1 mx-1 bg-orange-500 rounded-full"></span>
            <span className="inline-block w-20 h-1 bg-orange-500 rounded-full"></span>
            <span className="inline-block w-10 h-1 mx-1 bg-orange-500 rounded-full"></span>
          </div>
          {cfg.vision?.text && (
            <p className="text-gray-800 text-2xl max-w-[35rem] mx-auto lg:mx-0 ">
              {cfg.vision.text}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MisionVision;
