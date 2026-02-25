import Footer from "@/components/Footer/Footer";
import MisionVision from "@/components/ComponentsSobreNosotrosOmega/MisionVision/MisionVision";
import Navbar from "@/components/NavigationBar/NavBar";
import OmegaShowcase2 from "@/components/ComponentsSobreNosotrosOmega/OmegaShowcase2/OmegaShowcase2";
import { TabsDemo } from "@/components/ComponentsSobreNosotrosOmega/TabsMenu/TabsDemo";
import WorkComponent from "@/components/ComponentsSobreNosotrosOmega/workProcess/WorkComponent";
import StatsComponent from "@/components/ComponentsSobreNosotrosOmega/Stats/StatsComponent";
import BrandsComponentDivition from "@/components/ComponentsSobreNosotrosOmega/BrandsComponent/BrandsConponentDivition";
import { ContactComponent } from "@/components/ComponentsSobreNosotrosOmega/Contact/Contact";

export default function Home() {

  return (
    <div className=" min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]" style={{ background:"var(--bgweb)"}}>
      <Navbar/>
      <OmegaShowcase2/>
      <MisionVision />
      <TabsDemo/>
      <WorkComponent/>
      <StatsComponent/>
      <BrandsComponentDivition/>
      <ContactComponent/>
      <Footer/>
    </div>
  );
}