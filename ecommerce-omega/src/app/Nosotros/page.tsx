"use client";

import ImageWithContent2AboutUs from "../Components/AboutUS/ImageWithContent2AboutUs";
import ImageWithContentAboutUs from "../Components/AboutUS/ImageWithContentAboutUs";
import Footer from "../Components/Footer/Footer";
import { SkeletonFour } from "../Components/Globe/SkeletonFour";
import MoovingLogos from "../Components/MoovingLogos/MoovingLogos";
import Navbar from "../Components/NavigationBar/NavBar";

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