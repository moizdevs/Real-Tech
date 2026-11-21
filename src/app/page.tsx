import dynamic from "next/dynamic";
import Motion from "@/components/ui/Motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PowerIntroSection from "@/components/sections/PowerIntroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import InteractiveCircuitSection from "@/components/sections/InteractiveCircuitSection";
import RepairProcessSection from "@/components/sections/RepairProcessSection";
import DiagnosticSection from "@/components/sections/DiagnosticSection";
import TrustSection from "@/components/sections/TrustSection";
import ContactSection from "@/components/sections/ContactSection";

// The WebGL scene is loaded client-side only, after first paint.
const SceneLayer = dynamic(() => import("@/components/three/SceneLayer"));

export default function Home() {
  return (
    <Motion>
      <SceneLayer />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <PowerIntroSection />
        <ServicesSection />
        <InteractiveCircuitSection />
        <RepairProcessSection />
        <DiagnosticSection />
        <TrustSection />
        <ContactSection />
      </main>
      <Footer />
    </Motion>
  );
}
