import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/NavigationBar/NavBar";
import { ContactComponent } from "../Components/ComponentsSobreNosotrosOmega/Contact/Contact";
import { TabsSection } from "./TabsSection/TabsSection";
import {  TimelineSection } from "./TimelineSection/page";
import { HeroDW } from "./Hero/HeroDW";



export default function Home() {

  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]">
      <Navbar/>
      <HeroDW
      title="Launch your website in hours, not days"
      subtitle="With AI, you can launch your website in hours, not days. Try our best in class tools."
      primaryButton={{ label: "Explore Now", href: "/explore" }}
      secondaryButton={{ label: "Contact Support", href: "/contact" }}
      image={{
        src: "https://assets.aceternity.com/pro/aceternity-landing.webp",
        alt: "Landing page preview",
        aspect: "aspect-[16/9]",
      }}
    />
      <TabsSection></TabsSection>
      <TimelineSection></TimelineSection>
      <ContactComponent/>
      <Footer/>
    </div>
  );
}