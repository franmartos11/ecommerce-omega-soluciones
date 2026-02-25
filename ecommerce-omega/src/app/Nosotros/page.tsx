"use client";

import ImageWithContent2AboutUs from "@/components/AboutUS/ImageWithContent2AboutUs";
import ImageWithContentAboutUs from "@/components/AboutUS/ImageWithContentAboutUs";
import Footer from "@/components/Footer/Footer";
import { SkeletonFour } from "@/components/Globe/SkeletonFour";
import MoovingLogos from "@/components/MoovingLogos/MoovingLogos";
import Navbar from "@/components/NavigationBar/NavBar";

export default function about() {
    return (
        <div className="p-8 bg-white">
            <Navbar/>
            <ImageWithContentAboutUs/>
            <ImageWithContent2AboutUs/>
            <SkeletonFour></SkeletonFour>
            <MoovingLogos/>
            <Footer/>
        </div>
    )
}