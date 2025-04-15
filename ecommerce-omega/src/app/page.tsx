import Image from "next/image";
import ProductCard from "./Components/ProductCard/ProductCard";
import ProductCardGrid, { Product } from "./Components/ProductCardGrid/ProductCardGrid";
import ProductListSection from "./Components/ProductListSection/ProductListSection";

export default function Home() {

  const productos: Product[] = [
    {
      id: "1",
      imageUrl: "/mattress.png",
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
      imageUrl: "/scooter.png",
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
      imageUrl: "/bed.png",
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
      id: "4",
      imageUrl: "/bed.png",
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
      imageUrl: "/bed.png",
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
      imageUrl: "/bed.png",
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
      imageUrl: "/bed.png",
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
      imageUrl: "/bed.png",
      category: "Categoria",
      title: "Blue Diamond Almonds Lightly",
      rating: 4.0,
      seller: "NestFood",
      currentPrice: 23.85,
      oldPrice: 25.8,
      color: "Blue",
      condition: "Refurbished",
    },
  ];
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
      <ProductListSection
      title="Ofertas destacadas"
      products={productos}
      showFilter={true}
    />

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
