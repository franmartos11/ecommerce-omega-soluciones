"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

const images = [
  "/banner1.webp",
  "/banner2.webp",
  "/banner3.webp",
];

const CarouselBanner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    const interval = setInterval(() => {
      emblaApi?.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [emblaApi]);

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
