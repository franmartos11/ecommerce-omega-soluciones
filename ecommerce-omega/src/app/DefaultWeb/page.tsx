import { ContactComponent } from "@/components/ComponentsSobreNosotrosOmega/Contact/ContactDefaultWeb";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/NavigationBar/NavBar";
import { HeroDWFromConfig } from "./Hero/HeroDW";
import { TabsSection } from "./TabsSection/TabsSection";
import { TimelineSection } from "./TimelineSection/TimelineSection";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]" style={{ background: "var(--bgweb)" }}>
      <Navbar />
      <HeroDWFromConfig />
      <TabsSection />
      <TimelineSection />
      <ContactComponent />
      <Footer />
    </div>
  );
}
