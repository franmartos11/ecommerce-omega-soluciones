'use client';

import { SiFacebook, SiInstagram, SiX, SiYoutube, SiLinkedin } from "react-icons/si";
import { MapPin, Phone, Mail, Clock4, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";

/* ===== utils ===== */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);

type FormData = { name: string; email: string; pn: string; subject: string; message: string; };

export default function ContactCardImg() {
  const cfg = useConfig();

  const contactanos = isRecord(cfg.Contactanos) ? cfg.Contactanos : {};
  const textoPrincipal = str(contactanos.TextoPrincipal, "¡Estamos aquí para ayudarte! Completá el formulario y te respondemos en el día.");

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
  const emailAddr = str(contactanos.email, str(cfg.Soporte?.email, ""));

  const redes = cfg.Redes ?? {};
  const socialLinks = [
    { key: "Facebook", href: redes.Facebook, Icon: SiFacebook },
    { key: "Instagram", href: redes.Instagram, Icon: SiInstagram },
    { key: "Twitter", href: redes.Twitter, Icon: SiX },
    { key: "YouTube", href: redes.YouTube, Icon: SiYoutube },
    { key: "LinkedIn", href: redes.LinkedIn, Icon: SiLinkedin },
  ].filter(r => typeof r.href === "string" && r.href.length > 0) as Array<{ key: string; href: string; Icon: React.ComponentType<{ className?: string }> }>;

  const [formData, setFormData] = useState<FormData>({ name: "", email: "", pn: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", pn: "", subject: "", message: "" });
      } else {
        alert("Error al enviar. Intentá nuevamente.");
      }
    } catch {
      alert("Error de conexión. Intentá nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const direccionLinea = [direccion, ciudad, provincia, pais].filter(Boolean).join(", ");
  const telHref = tel ? `tel:${tel.replace(/\s+/g, "")}` : "#";
  const mailHref = emailAddr ? `mailto:${emailAddr}` : "#";

  // Shared input style — matches the existing ProductoDetailPage select/inputs
  const inputStyle: React.CSSProperties = {
    borderColor: "var(--border, #e5e7eb)",
    color: "var(--color-primary-text)",
    background: "var(--bgweb)",
  };

  const infoItems = [
    ...(direccionLinea ? [{ Icon: MapPin, label: "Dirección", value: direccionLinea, href: mapsUrl !== "#" ? mapsUrl : undefined }] : []),
    ...(tel ? [{ Icon: Phone, label: "Teléfono", value: tel, href: telHref }] : []),
    ...(emailAddr ? [{ Icon: Mail, label: "Email", value: emailAddr, href: mailHref }] : []),
    { Icon: Clock4, label: "Horario", value: "Lunes a Viernes, 9:00 – 18:00", href: undefined },
  ];

  return (
    <section
      className="px-4 sm:px-8 py-10 max-w-6xl mx-auto"
      style={{ color: "var(--color-primary-text)" }}
    >
      {/* Page heading — same style as OrdersPanel h1 */}
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: "var(--color-primary-text)" }}
      >
        Contáctanos
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--color-secondary-text)" }}>
        {textoPrincipal}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── Form card (2/3) ── */}
        <div
          className="lg:col-span-2 rounded-xl border shadow-sm p-8"
          style={{
            background: "var(--surface, #ffffff)",
            borderColor: "var(--border, #e5e7eb)",
          }}
        >
          {submitted ? (
            <div className="flex flex-col items-center text-center py-12">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-5"
                style={{ background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)" }}
              >
                ✓
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-primary-text)" }}>
                ¡Mensaje enviado correctamente!
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-secondary-text)" }}>
                Te vamos a responder en menos de 24 horas hábiles.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm font-medium underline"
                style={{ color: "var(--color-primary-bg)" }}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row: Nombre + Email + Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Nombre *", name: "name", type: "text", placeholder: "Tu nombre" },
                  { label: "Email *", name: "email", type: "email", placeholder: "tu@email.com" },
                  { label: "Teléfono", name: "pn", type: "tel", placeholder: "+54 9 351..." },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-secondary-text)" }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={(formData as Record<string, string>)[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      required={f.name !== "pn"}
                      className="w-full border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-bg)] focus:ring-opacity-30"
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-secondary-text)" }}>
                  Asunto *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  required
                  className="w-full border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-bg)] focus:ring-opacity-30"
                  style={inputStyle}
                />
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-secondary-text)" }}>
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Contanos tu consulta o proyecto..."
                  required
                  className="w-full border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-bg)] focus:ring-opacity-30 resize-none"
                  style={inputStyle}
                />
              </div>

              {/* Submit — same pattern as ProductoDetailPage's "Agregar" button */}
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-60"
                style={{
                  background: "var(--color-primary-bg)",
                  color: "var(--color-tertiary-text)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--color-secondary-bg)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--color-primary-bg)")}
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="w-4 h-4" /> Enviar mensaje</>
                )}
              </button>
            </form>
          )}
        </div>

        {/* ── Info sidebar (1/3) ── */}
        <div className="space-y-5">
          {/* Logo card */}
          <div
            className="rounded-xl border shadow-sm flex items-center justify-center p-6"
            style={{ background: "var(--surface, #ffffff)", borderColor: "var(--border, #e5e7eb)" }}
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={160}
              height={100}
              className="object-contain max-h-24 w-auto"
            />
          </div>

          {/* Contact info card */}
          <div
            className="rounded-xl border shadow-sm p-6 space-y-4"
            style={{ background: "var(--surface, #ffffff)", borderColor: "var(--border, #e5e7eb)" }}
          >
            <h3 className="text-base font-semibold mb-1" style={{ color: "var(--color-primary-text)" }}>
              Información de contacto
            </h3>

            {infoItems.map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "var(--color-primary-bg)" }}
                />
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-secondary-text)" }}>
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-sm leading-relaxed hover:underline"
                      style={{ color: "var(--color-primary-text)" }}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-primary-text)" }}>
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social card */}
          {socialLinks.length > 0 && (
            <div
              className="rounded-xl border shadow-sm p-6"
              style={{ background: "var(--surface, #ffffff)", borderColor: "var(--border, #e5e7eb)" }}
            >
              <h3 className="text-base font-semibold mb-4" style={{ color: "var(--color-primary-text)" }}>
                Seguinos
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ key, href, Icon }) => (
                  <Link
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={key}
                    className="w-9 h-9 rounded-md border flex items-center justify-center transition-colors"
                    style={{
                      borderColor: "var(--border, #e5e7eb)",
                      color: "var(--color-secondary-text)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "var(--color-primary-bg)";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-tertiary-text)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary-bg)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-secondary-text)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border, #e5e7eb)";
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
