/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn.tu-dominio.com",           // 👈 agrega tu CDN
      "arcencohogar.vtexassets.com",  // si usas estas imágenes también
    ],
  },
};

module.exports = nextConfig;
