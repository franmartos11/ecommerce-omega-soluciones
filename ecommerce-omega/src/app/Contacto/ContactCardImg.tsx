'use client';

import { SiFacebook, SiInstagram, SiX, SiYoutube, SiLinkedin } from "react-icons/si";
import Link from "next/link";
import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";

/* ===== utils de tipo/fallbacks sin any ===== */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);

type FormData = { name: string; email: string; pn: string; subject: string; message: string; };

export default function ContactCardImg() {
  const cfg = useConfig();

  // ---------- Contactanos ----------
  const contactanos = isRecord(cfg.Contactanos) ? cfg.Contactanos : {};
  const textoPrincipal = str(contactanos.TextoPrincipal, "¡Estamos aquí para ayudarte!");

  const logoObj = isRecord(contactanos.Logo) ? contactanos.Logo : undefined;
  const logoSrc = str(logoObj?.src, str(cfg.Logo?.src, "/logo2.png"));
  const logoAlt = str(logoObj?.alt, str(cfg.Logo?.alt, cfg.sitio?.nombre ?? "Logo"));

  const ubic = isRecord(contactanos.Ubicacion) ? contactanos.Ubicacion : {};
  const direccion = str(ubic.direccion);
  const ciudad = str(ubic.ciudad);
  const provincia = str(ubic.provincia);
  const pais = str(ubic.pais);
  const mapsUrl = str(ubic.mapsUrl, "#");

  const tel = str(contactanos.tel, str(cfg.Soporte?.tel, cfg.NumTelefonoSoporte ?? ""));
  const email = str(contactanos.email, str(cfg.Soporte?.email, ""));

  // ---------- Redes (opcionales) ----------
  const redes = cfg.Redes ?? {};
  const socialLinks = [
    { key: "Facebook", href: redes.Facebook, Icon: SiFacebook },
    { key: "Instagram", href: redes.Instagram, Icon: SiInstagram },
    { key: "Twitter", href: redes.Twitter, Icon: SiX },
    { key: "YouTube", href: redes.YouTube, Icon: SiYoutube },
    { key: "LinkedIn", href: redes.LinkedIn, Icon: SiLinkedin },
  ].filter(r => typeof r.href === "string" && r.href.length > 0) as Array<{key:string; href:string; Icon: React.ComponentType<{className?: string}>}>;

  // ---------- Form ----------
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", pn: "", subject: "", message: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Email enviado");
        setFormData({ name: "", email: "", pn: "", subject: "", message: "" });
      } else {
        alert("Error al enviar");
      }
    } catch (error) {
      console.error(error);
      alert("Error al enviar");
    }
  };

  // ---------- strings derivados ----------
  const direccionLinea = [direccion, ciudad, provincia, pais].filter(Boolean).join(", ");
  const telHref = tel ? `tel:${tel.replace(/\s+/g, "")}` : "#";
  const mailHref = email ? `mailto:${email}` : "#";

  return (
    <section className="min-h-screen pt-[0rem] pb-[7.8rem] gowun-batang-regular">
      <div className="container px-6 mx-auto">
        <div className="lg:flex lg:items-center lg:-mx-10">
          {/* Card izquierda: formulario */}
          <div className="lg:w-1/2 lg:mx-10 bg-bg1 p-[2.5rem] rounded-2xl">
            <h1 className="text-3xl font-semibold capitalize text-white lg:text-5xl">
              Contactanos
            </h1>
            <p className="mt-4 text-white">{textoPrincipal}</p>

            <form className="mt-12" onSubmit={handleSubmit}>
              <div className="-mx-2 md:items-center md:flex">
                <div className="flex-1 px-2">
                  <label className="block mb-2 text-base text-white">Nombre Completo</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className="block w-full px-5 py-3 mt-2 border rounded-md placeholder-gray-600 bg-bg2 text-gray-800 border-white focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>

                <div className="flex-1 px-2 mt-4 md:mt-0">
                  <label className="block mb-2 text-base text-white">Email</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className="block w-full px-5 py-3 mt-2 border rounded-md placeholder-gray-600 bg-bg2 text-gray-800 border-white focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>

                <div className="flex-1 px-2 mt-4 md:mt-0">
                  <label className="block mb-2 text-base text-white">Número de Teléfono</label>
                  <input
                    type="text" name="pn" value={formData.pn} onChange={handleChange}
                    className="block w-full px-5 py-3 mt-2 border rounded-md placeholder-gray-600 bg-bg2 text-gray-800 border-white focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>
              </div>

              <div className="w-full mt-4">
                <label className="block mb-2 text-base text-white">Asunto</label>
                <input
                  type="text" name="subject" value={formData.subject} onChange={handleChange}
                  className="block w-full px-5 py-3 mt-2 border rounded-md placeholder-gray-600 bg-bg2 text-gray-800 border-white focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
              </div>

              <div className="w-full mt-4">
                <label className="block mb-2 text-base text-white">Mensaje</label>
                <textarea
                  name="message" value={formData.message} onChange={handleChange}
                  className="block w-full h-20 px-5 py-3 mt-2 border rounded-md md:h-56 placeholder-gray-600 bg-bg2 text-gray-800 border-white focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  required
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full px-6 py-3 mt-4 text-base font-medium tracking-wide text-white border-white capitalize transition-colors duration-300 rounded-md bg-bg2 focus:outline-none focus:ring focus:ring-blue-900 focus:ring-opacity-50"
              >
                Enviar
              </button>
            </form>
          </div>

          {/* Columna derecha: info de contacto desde config */}
          <div className="mt-12 pt-[3rem] lg:flex lg:mt-0 lg:flex-col lg:items-center lg:w-1/2 lg:mx-10">
            <Image
              className="hidden bg-bg1 object-cover mx-auto rounded-full lg:block shrink-0 w-96 h-96"
              src={logoSrc}
              alt={logoAlt}
              title={logoAlt}
              width={612}
              height={612}
            />

            <div className="mt-6 space-y-8 md:mt-8">
              {/* Ubicación */}
              <p className="flex items-start -mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="mx-2 truncate w-72 text-gray-600">
                  {mapsUrl !== "#" ? (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      {direccionLinea || "Ubicación"}
                    </a>
                  ) : (
                    direccionLinea || "Ubicación"
                  )}
                </span>
              </p>

              {/* Teléfono */}
              <p className="flex items-start -mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="mx-2 truncate w-72 text-gray-600">
                  {tel ? <a href={telHref}>{tel}</a> : "Teléfono no disponible"}
                </span>
              </p>

              {/* Email */}
              <p className="flex items-start -mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="mx-2 truncate w-72 text-gray-600">
                  {email ? <a href={mailHref}>{email}</a> : "Email no disponible"}
                </span>
              </p>
            </div>

            {/* Redes sociales desde config.Redes */}
            {socialLinks.length > 0 && (
              <div className="mt-6 w-80 md:mt-8">
                <h3 className="text-gray-900">Seguinos</h3>
                <div className="flex mt-4 -mx-1.5 space-x-5">
                  {socialLinks.map(({ key, href, Icon }) => (
                    <Link key={key} href={href} className="text-gray-600 hover:text-bg1" target="_blank" rel="noopener noreferrer">
                      <Icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
