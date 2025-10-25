import Footer from "../Components/Footer/Footer";
import MisionVision from "../Components/ComponentsSobreNosotrosOmega/MisionVision/MisionVision";
import Navbar from "../Components/NavigationBar/NavBar";
import OmegaShowcase2 from "../Components/ComponentsSobreNosotrosOmega/OmegaShowcase2/OmegaShowcase2";
import { TabsDemo } from "../Components/ComponentsSobreNosotrosOmega/TabsMenu/TabsDemo";
import WorkComponent from "../Components/ComponentsSobreNosotrosOmega/workProcess/WorkComponent";
import StatsComponent from "../Components/ComponentsSobreNosotrosOmega/Stats/StatsComponent";
import BrandsComponentDivition from "../Components/ComponentsSobreNosotrosOmega/BrandsComponent/BrandsConponentDivition";
import { ContactComponent } from "../Components/ComponentsSobreNosotrosOmega/Contact/Contact";

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