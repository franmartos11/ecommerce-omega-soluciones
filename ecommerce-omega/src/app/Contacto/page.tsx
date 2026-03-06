import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/NavigationBar/NavBar";
import ContactCardImg from "./ContactCardImg";

export default function Contact() {
    return (
        <div className="min-h-screen pb-0 font-[family-name:var(--font-geist-sans)]" style={{ background: "var(--bgweb)" }}>
                <Navbar/>
                <ContactCardImg/>
                <Footer/>
        </div>
    );
}