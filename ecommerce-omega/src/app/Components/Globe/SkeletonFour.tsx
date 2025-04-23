"use client";
import React, { useEffect, useRef } from "react";
import createGlob from "cobe";

export const SkeletonFour = () => {
  return (
    <div className="h-auto  flex flex-col items-center mt-10  z-10">
      <h3 className=" pb-10 gowun-batang-bold pt-14 text-4xl font-semibold  text-center">
        Based in Miami FL, working worldwide
      </h3>
      <Globe className=" w-full" />
    </div>
  );
};

interface GlobeState {
  phi?: number;
  theta?: number;
  [key: string]: any; // Add other properties as needed
}

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlob(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 0.7,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        
        { location: [30.7128, -79.006], size: 0.1 },
      ],
      onRender: (state: GlobeState) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi -= 0.001;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};

