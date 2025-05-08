"use client";
import { useState, useEffect, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";

const OmegaShowcase2 = () => {
  const [activeSection, setActiveSection] = useState("omega-soluciones");

  const sections = [
    {
      id: "omega-distribuciones",
      logo: "/SobreNosotros/33.webp",
      title: "OMEGA DISTRIBUCIONES",
      description:
        "Comercialización y distribución de todo tipo de productos y servicios.",
    },
    {
      id: "omega-clean",
      logo: "/SobreNosotros/1cc.webp",
      title: "OMEGA CLEAN",
      description:
        "Fabricación y envasado de productos de higiene doméstica e institucional.",
    },
    {
      id: "omega-construcciones",
      logo: "/SobreNosotros/4c.webp",
      title: "OMEGA CONSTRUCCIONES",
      description:
        "Diseño, construcción, remodelación y desarrollo de todo tipo de proyectos.",
    },
    {
      id: "omega-tech",
      logo: "/SobreNosotros/2t.webp",
      title: "OMEGA TECH",
      description:
        "Desarrollo de software a medida y comercialización de hardware.",
    },
    {
      id: "omega-soluciones",
      logo: "/SobreNosotros/1.webp",
      title: "OMEGA SOLUCIONES",
      description:
        "Múltiples unidades de negocio diseñadas para satisfacer diferentes necesidades.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => {
        const currentIndex = sections.findIndex((section) => section.id === prev);
        const nextIndex = (currentIndex + 1) % sections.length;
        return sections[nextIndex].id;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = (id: SetStateAction<string>) => {
    setActiveSection(id);
  };

  return (
    <div
      id="hero"
      className=" bg-no-repeat bg-cover bg-center flex flex-col lg:flex-row items-center justify-center p-2 lg:p-8 min-h-[80vh]"
    >

      <div className="bg-[url('/SobreNosotros/bgg.webp')] bg-center bg-no-repeat bg-cover relative flex items-center justify-center w-[20rem] lg:w-[29rem] h-[20rem] lg:h-[29rem]">
        {sections.map((section, index) => {
          const positionClasses = [
            "absolute top-2 left-2",
            "absolute top-2 right-2",
            "absolute bottom-2 left-2",
            "absolute bottom-2 right-2",
          ];

          const isActive = section.id === activeSection;
          const isMainButton = section.id === "omega-soluciones";

          return (
            <button
              key={section.id}
              onClick={() => handleLogoClick(section.id)}
              className={`${positionClasses[index]} ${isMainButton
                  ? "w-[10rem] lg:w-[15rem] h-[10rem] lg:h-[15rem]"
                  : "w-[5rem] lg:w-[8rem] h-[5rem] lg:h-[8rem]"
                } rounded-full border-2 ${isActive
                  ? "shadow-lg shadow-orange-500 border-orange-500 scale-110"
                  : "shadow-md border-gray-300"
                } bg-white transition-all duration-300`}
            >
              <img
                src={section.logo}
                alt={section.title}
                className={`w-full h-full object-contain rounded-full ${isActive ? "brightness-110" : ""
                  }`}
              />
            </button>
          );
        })}
      </div>

      <motion.div
        className="ml-[0rem] lg:ml-[5rem] mt-2 lg:mt-0 text-center lg:text-start lg:pl-[2rem] max-w-[25rem] lg:max-w-[35rem] px-4"
        key={activeSection}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h2 className="pt-[1rem] text-3xl lg:text-4xl font-semibold text-[#f86709]">
          {sections.find((section) => section.id === activeSection)?.title}
        </h2>
        <motion.p
          className="text-lg lg:text-2xl font-bold text-gray-500 mt-[1rem]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {sections.find((section) => section.id === activeSection)?.description}
        </motion.p>
        <div className="pt-[1.5rem]">
          <Link
            className="px-6 py-3 uppercase bg-white text-black font-semibold rounded-full shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            to="tabsDemo"
            smooth={true}
            duration={500}
          >
            Más Información
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OmegaShowcase2;