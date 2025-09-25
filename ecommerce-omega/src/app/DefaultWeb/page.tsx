import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/NavigationBar/NavBar";
import { ContactComponent } from "../Components/ComponentsSobreNosotrosOmega/Contact/Contact";
import { Hero } from "./Hero/page";
import { TabsSection } from "./TabsSection/page";
import {  TimelineSection } from "./TimelineSection/page";

export default function Home() {

  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]">
      <Navbar/>
      <Hero></Hero>
      <TabsSection></TabsSection>
      <TimelineSection></TimelineSection>
      <ContactComponent/>
      <Footer/>
    </div>
  );
}