"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMail } from "react-icons/fi";
import Image from "next/image";

export const ContactComponent = () => {
    return (
        <section id="contactanos" className="px-6 lg:px-12  bg-no-repeat bg-cover bg-center min-h-screen flex flex-col justify-center py-12">
            <div className="container mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Imagen del logo */}
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                >
                    <Image
                        src="/SobreNosotros/1.webp"
                        alt="Omega Logo"
                        width={300}
                        height={300}
                        className="w-[12rem] lg:w-[20rem] h-[12rem] lg:h-[20rem] rounded-full  shadow-lg"
                        priority
                    />
                </motion.div>
                
                {/* Información de contacto */}
                <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="text-3xl uppercase text-black font-bold lg:text-5xl">
                        Contáctanos
                    </h2>
                    <p className="text-black text-lg lg:text-xl">
                        Ven a visitarnos o contáctanos por teléfono o correo electrónico.
                    </p>

                    {/* Lista de contactos */}
                    <div className="space-y-6">
                        {[
                            { title: "Administración", email: "administracion@omegasoluciones.com.ar" },
                            { title: "Ventas", email: "ventas@omegasoluciones.com.ar", phone: "+54 9 387 619 5572" },
                            { title: "Compras", email: "compras@omegasoluciones.com.ar", phone: "+54 9 387 210 5425" },
                        ].map(({ title, email, phone }, index) => (
                            <div key={index}>
                                <p className="text-xl text-black font-semibold">{title}</p>
                                <div className="flex items-center gap-4 mt-0">
                                    <FiMail className="text-black h-[1rem] w-5" />
                                    <a href={`mailto:${email}`} className="text-black text-lg hover:text-[#f86709]">
                                        {email}
                                    </a>
                                </div>
                                {phone && (
                                    <div className="flex items-center gap-4 mt-0">
                                        <FiPhone className="text-black h-[1rem] w-5" />
                                        <a href={`https://wa.me/549${phone.replace(/[^0-9]/g, '')}?text=Hola!%20`} className="text-black text-lg hover:text-[#f86709]">
                                            {phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Mapa */}
            <motion.div
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="mt-6 mx-auto w-full max-w-6xl shadow-lg rounded-lg overflow-hidden"
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4917.1284462890555!2d-65.41137!3d-24.7618653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc36adcbf6bd9%3A0x9db0642ee2c946ce!2sOmega%20Soluciones!5e0!3m2!1ses-419!2sar!4v1699621807831!5m2!1ses-419!2sar"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Ubicación en el mapa"
                ></iframe>
            </motion.div>
        </section>
    );
};


