"use client";

import React, { useState, useRef } from "react";

const BrandsComponentDivition = () => {
  type Brand = {
    name: string;
    logo: string;
    type: string;
  };

  const allBrands: Brand[] = [
    // Tecnología y Electrónica
    { name: "Epson", logo: "/SobreNosotros/epsonLogo.webp", type: "Tecnología y Electrónica" },
    { name: "Brother", logo: "/SobreNosotros/brotherLogo.webp", type: "Tecnología y Electrónica" },
    { name: "Noblex", logo: "/SobreNosotros/noblexLogo.png", type: "Tecnología y Electrónica" },
    { name: "Philco", logo: "/SobreNosotros/philcoLogo.webp", type: "Tecnología y Electrónica" },
    { name: "Kanji", logo: "/SobreNosotros/kanjiLogo.webp", type: "Tecnología y Electrónica" },
    { name: "LG", logo: "/SobreNosotros/lg_logo.webp", type: "Tecnología y Electrónica" },
    { name: "Motorola", logo: "/SobreNosotros/motorolaLogo.png", type: "Tecnología y Electrónica" },
    { name: "Lenovo", logo: "/SobreNosotros/lenovoLogo.webp", type: "Tecnología y Electrónica" },
    { name: "Hp", logo: "/SobreNosotros/hpLogo.webp", type: "Tecnología y Electrónica" },
    { name: "Dell", logo: "/SobreNosotros/dellLogo.webp", type: "Tecnología y Electrónica" },
    { name: "Asus", logo: "/SobreNosotros/asusLogo.webp", type: "Tecnología y Electrónica" },
    { name: "Intel", logo: "/SobreNosotros/intelLogo.png", type: "Tecnología y Electrónica" },

    // Herramientas y Equipamiento Industrial
    { name: "Bosch", logo: "/SobreNosotros/BoschLogo.png", type: "Herramientas y Equipamiento Industrial" },
    { name: "Cat", logo: "/SobreNosotros/cat.png", type: "Herramientas y Equipamiento Industrial" },
    { name: "Makita", logo: "/SobreNosotros/makitaLogo.png", type: "Herramientas y Equipamiento Industrial" },
    { name: "Stihl", logo: "/SobreNosotros/stihlLogo.png", type: "Herramientas y Equipamiento Industrial" },
    { name: "Biassoni", logo: "/SobreNosotros/biassoniLogo.png", type: "Herramientas y Equipamiento Industrial" },

    // Electrodomésticos
    { name: "Drean", logo: "/SobreNosotros/dreanLogo.png", type: "Electrodomésticos" },
    { name: "Noblex", logo: "/SobreNosotros/noblexLogo.png", type: "Electrodomésticos" },
    { name: "LG", logo: "/SobreNosotros/lg_logo.webp", type: "Electrodomésticos" },
    { name: "Inelro", logo: "/SobreNosotros/inelro.png", type: "Electrodomésticos" },

    // Materiales de Construcción
    { name: "Tinacos", logo: "/SobreNosotros/tinacosLogo.webp", type: "Materiales de Construcción" },

    // Cuidado Personal y Familiar
    { name: "Johnson & Johnson", logo: "/SobreNosotros/j&j.svg", type: "Cuidado Personal y Familiar" },
    { name: "Pampers", logo: "/SobreNosotros/pampersLogo.png", type: "Cuidado Personal y Familiar" },
    { name: "Babysec", logo: "/SobreNosotros/babysecLogo.png", type: "Cuidado Personal y Familiar" },

    // Descartable
    { name: "Koval", logo: "/SobreNosotros/kovalplastLogo.png", type: "Descartable" },
    { name: "Cellpack", logo: "/SobreNosotros/cellpackLogo.png", type: "Descartable" },

    // Productos Químicos y de Limpieza
    { name: "Raid", logo: "/SobreNosotros/raidLogo.webp", type: "Productos Químicos y de Limpieza" },
    { name: "Sacchi", logo: "/SobreNosotros/sacchiLogo.png", type: "Productos Químicos y de Limpieza" },
    { name: "Elite", logo: "/SobreNosotros/eliteLogo.png", type: "Productos Químicos y de Limpieza" },
    { name: "Virulana", logo: "/SobreNosotros/virulanaLogo3.png", type: "Productos Químicos y de Limpieza" },
    { name: "Wassington", logo: "/SobreNosotros/wassingtonLogo.webp", type: "Productos Químicos y de Limpieza" },
    { name: "Lysoform", logo: "/SobreNosotros/lisoform.webp", type: "Productos Químicos y de Limpieza" },
    { name: "Media Naranja", logo: "/SobreNosotros/mediaNaranjaLogo.webp", type: "Productos Químicos y de Limpieza" },
  ];

  const groupedBrands: { [key: string]: Brand[] } = allBrands.reduce((acc, brand) => {
    if (!acc[brand.type]) {
      acc[brand.type] = [];
    }
    acc[brand.type].push(brand);
    return acc;
  }, {} as { [key: string]: Brand[] });

  const [visibleCategory, setVisibleCategory] = useState<string | null>("Tecnología y Electrónica");
  const brandsRef = useRef<HTMLDivElement | null>(null);

  const handleCategoryClick = (type: string) => {
    setVisibleCategory((prev) => (prev === type ? null : type));


    if (window.innerWidth < 768) {
      setTimeout(() => {
        if (brandsRef.current) {
          window.scrollTo({
            top: brandsRef.current.offsetTop - 120,
            behavior: "smooth",
          });
        }
      }, 200);
    }
  };

  return (
    <section id="marcas" className=" min-h-screen pt-20 py-20 px-4 text-center">
      <div className="container mx-auto">
        <h2 className="text-4xl font-semibold text-center capitalize lg:text-6xl text-black">
          TRABAJAMOS CON LAS MEJORES MARCAS
        </h2>
        <div className="flex justify-center mx-auto mt-4">
          <span className="inline-block w-20 h-1 bg-orange-500 rounded-full"></span>
          <span className="inline-block w-10 h-1 mx-1 bg-orange-500 rounded-full"></span>
          <span className="inline-block w-5 h-1 bg-orange-500 rounded-full"></span>
          <span className="inline-block w-20 h-1 bg-orange-500 rounded-full"></span>
        </div>
      </div>

      <div className="container mx-auto mt-10">
        <div className="flex flex-wrap justify-center gap-4">
          {Object.keys(groupedBrands).map((type) => (
            <button
              key={type}
              onClick={() => handleCategoryClick(type)}
              className="w-[48%] sm:w-auto px-6 py-3 bg-orange-500 text-white sm:font-semibold text-xs sm:text-sm uppercase font-extralight rounded-lg shadow-lg hover:bg-orange-700 transition duration-300 text-center"
            >
              {type}
            </button>
          ))}
        </div>

        {visibleCategory && (
          <div ref={brandsRef} className="mt-10">
            <h3 className="text-2xl font-bold text-left text-black mb-4">{visibleCategory}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {groupedBrands[visibleCategory].map((brand, index) => (
                <div key={index} className="flex items-center justify-center bg-white rounded-lg shadow-md p-4 hover:bg-orange-300 transition duration-300">
                  <img src={brand.logo} alt={brand.name} title={brand.name} className="h-[4rem] w-[4rem] object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandsComponentDivition;
