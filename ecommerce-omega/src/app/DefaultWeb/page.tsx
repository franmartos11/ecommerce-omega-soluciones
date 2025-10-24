import { ContactComponent } from "../Components/ComponentsSobreNosotrosOmega/Contact/ContactDefaultWeb";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/NavigationBar/NavBar";
import { HeroDWFromConfig } from "./Hero/HeroDW";
import { TabsSection } from "./TabsSection/TabsSection";
import { TimelineSection } from "./TimelineSection/TimelineSection";

export default function Home() {
  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <HeroDWFromConfig />
      <TabsSection />
      <TimelineSection />
      <ContactComponent />
      <Footer />
    </div>
  );
}
