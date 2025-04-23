"use client";

import { Suspense } from "react";
import ImageWithContent2AboutUs from "../Components/AboutUS/ImageWithContent2AboutUs";
import ImageWithContentAboutUs from "../Components/AboutUS/ImageWithContentAboutUs";
import Footer from "../Components/Footer/Footer";
import { SkeletonFour } from "../Components/Globe/SkeletonFour";
import MoovingLogos from "../Components/MoovingLogos/MoovingLogos";
import Navbar from "../Components/NavigationBar/NavBar";

export default function about() {
    return (
        <div className="p-8 bg-white">
            <Suspense fallback={<div className="p-6">Cargando....</div>}>
            <Navbar></Navbar>
            <ImageWithContentAboutUs></ImageWithContentAboutUs>
            <ImageWithContent2AboutUs></ImageWithContent2AboutUs>
            <SkeletonFour></SkeletonFour>
            <div className="mb-[8rem] pt-[9rem] text-center">
                <h2 className="text-blue-600 text-center font-medium mb-4 block">
                    Nuestros Clientes
                </h2>
                <h3 className="text-4xl  text-center font-bold">
                    Quienes confian en nosotros
                </h3>
            </div>
            <MoovingLogos></MoovingLogos>
            <Footer></Footer>
            </Suspense>
        </div>
    )
}