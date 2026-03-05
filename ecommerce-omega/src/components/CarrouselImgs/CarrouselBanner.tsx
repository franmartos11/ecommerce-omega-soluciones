import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

const CarouselBanner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [images, setImages] = useState<string[]>([
    "/banner1.webp",
    "/banner2.webp",
    "/banner3.webp",
  ]);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          if (settings.hero_banners && Array.isArray(settings.hero_banners) && settings.hero_banners.length > 0) {
            setImages(settings.hero_banners);
          }
        }
      } catch (error) {
        console.error("Error cargando banners:", error);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      emblaApi?.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  if (images.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl mb-8 w-full">
      <div
        className="embla w-full aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] lg:aspect-[16/3.5]"
        ref={emblaRef}
      >
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="flex-[0_0_100%]">
              <img
                src={src}
                alt={`Banner ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselBanner;
