import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className=" px-6 pt-8 bg-white text-gray-700 text-sm w-full ">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Columna 1 - Marca */}
        <div>
          <h4 className="text-lg font-semibold text-text1 mb-4">Deals</h4>
          <p>
            Transformamos tu experiencia de compra en algo simple y confiable.
            Productos de calidad, atención 24/7 y envíos a todo el país.
          </p>
        </div>

        {/* Columna 2 - Navegación */}
        <div>
          <h4 className="text-lg font-semibold text-text1 mb-4">Navegación</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-text1">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="SobreNosotros" className="hover:text-text1">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="SobreNosotros" className="hover:text-text1">
                Unidades de Negocio
              </Link>
            </li>
            <li>
              <Link href="SobreNosotros" className="hover:text-text1">
                Marcas
              </Link>
            </li>
            <li>
              <Link href="/Contacto" className="hover:text-text1">
                Contáctanos
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3 - Soporte */}
        <div>
          <h4 className="text-lg font-semibold text-text1 mb-4">Soporte</h4>
          <ul className="space-y-2">
            <Link
              className="flex items-center gap-2"
              href="https://wa.me/5493876195572"
              target="_blank"
            >
              <Phone className="w-4 h-4" /> <span>+54 9 3876 19‑5572</span>
            </Link>
            {/* Agregar el email del chad */}
            <Link
              className="flex items-center gap-2"
              href="https://wa.me/5493876195572"
              target="_blank"
            >
              <Mail className="w-4 h-4" /> <span>soporte@deals.com</span>
            </Link>
            <li className="text-gray-500">Centro de ayuda 24/7</li>
          </ul>
        </div>

        {/* Columna 4 - Redes */}
        <div>
          <h4 className="text-lg font-semibold text-text1 mb-4">Seguinos</h4>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-text1">
              <SiFacebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-text1">
              <SiInstagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-text1">
              <SiX className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Deals. Todos los derechos reservados.
        Disenado y Programado por Aspa Software
      </div>
    </footer>
  );
}
