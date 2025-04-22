import { Suspense } from "react";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/NavigationBar/NavBar";
import ContactCardImg from "./ContactCardImg";

export default function Contact() {
    return (
        <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]">
            <Suspense fallback={<div className="p-6">Cargando productos...</div>}>
                <Navbar></Navbar>
                <ContactCardImg></ContactCardImg>
                <Footer></Footer>
            </Suspense>
        </div>
    );
}