import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/NavigationBar/NavBar";

// ✅ Hero, Tabs y Timeline leen del JSON mediante useConfig()
import { HeroDWFromConfig } from "./Hero/HeroDW";
import { TabsSection } from "./TabsSection/TabsSection";
import { TimelineSection } from "./TimelineSection/TimelineSection";

// 🔁 Si tu ContactComponent aún no consume el JSON,
// podés reemplazar esta import por el componente que te pasé:
// import ContactCardImg from "../Components/Contact/ContactCardImg";
import { ContactComponent } from "../Components/ComponentsSobreNosotrosOmega/Contact/Contact";

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
