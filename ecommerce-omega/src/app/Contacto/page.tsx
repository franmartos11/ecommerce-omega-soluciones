import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/NavigationBar/NavBar";
import ContactCardImg from "./ContactCardImg";

export default function Contact() {
    return (
        <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]">
                <Navbar/>
                <ContactCardImg/>
                <Footer/>
        </div>
    );
}