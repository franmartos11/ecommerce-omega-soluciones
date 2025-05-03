
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className=" px-6 pt-8 bg-white text-gray-700 text-sm w-full ">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Columna 1 - Marca */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Deals</h4>
          <p>
            Transformamos tu experiencia de compra en algo simple y confiable.
            Productos de calidad, atención 24/7 y envíos a todo el país.
          </p>
        </div>

        {/* Columna 2 - Navegación */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Navegación</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-green-600">Inicio</Link></li>
            <li><Link href="#" className="hover:text-green-600">Nosotros</Link></li>
            <li><Link href="#" className="hover:text-green-600">Unidades de Negocio</Link></li>
            <li><Link href="#" className="hover:text-green-600">Marcas</Link></li>
            <li><Link href="/Contacto" className="hover:text-green-600">Contáctanos</Link></li>
          </ul>
        </div>

        {/* Columna 3 - Soporte */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Soporte</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> <span>1900 - 888</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> <span>soporte@deals.com</span>
            </li>
            <li className="text-gray-500">Centro de ayuda 24/7</li>
          </ul>
        </div>

        {/* Columna 4 - Redes */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Seguinos</h4>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-green-600">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-green-600">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-green-600">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Deals. Todos los derechos reservados.
      </div>
    </footer>
  );
}
