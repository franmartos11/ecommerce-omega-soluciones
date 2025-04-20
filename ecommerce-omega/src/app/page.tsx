'use client'
import { Product } from "./Components/ProductCardGrid/ProductCardGrid";
import ProductListSection from "./Components/ProductListSection/ProductListSection";
import { Suspense } from "react";
import Navbar from "./Components/NavigationBar/NavBar";
import Footer from "./Components/Footer/Footer";

export default function Home() {

  const mockProducts: Product[] = [
    {
      id: "1",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Seeds of Change Organic Quinoa",
      rating: 4.0,
      seller: "NestFood",
      currentPrice: 28.85,
      oldPrice: 32.8,
      badge: { label: "Sale", color: "bg-blue-500" },
      color: "Red",
      condition: "New",
    },
    {
      id: "2",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Foster Farms Takeout Crispy Classic",
      rating: 4.0,
      seller: "NestFood",
      currentPrice: 17.85,
      oldPrice: 19.8,
      color: "Green",
      condition: "Used",
    },
    {
      id: "3",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 4.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Green",
      condition: "Refurbished",
    },
    {
      id: "4",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 4.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "5",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 4.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "6",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 4.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "7",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 4.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "8",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 5.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "9",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 5.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "10",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 5.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "11",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 5.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "12",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 5.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "13",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 5.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "14",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 5.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
    {
      id: "15",
      imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 5.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
  ];

  return (
    <div className="bg-white  items-center justify-items-center min-h-screen p-8 pb-0 gap-16  font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Navbar></Navbar>
        <Suspense fallback={<div className="p-6">Cargando productos...</div>}>
          <ProductListSection
            title="Ofertas destacadas"
            products={mockProducts}
            showFilter
          />
        </Suspense>
        <Footer></Footer>
      </main>
    </div>
  );
}
