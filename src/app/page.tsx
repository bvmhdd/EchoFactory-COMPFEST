import KineticGrid from "@/components/ui/kinetic-grid";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { LivePreview } from "@/components/landing/live-preview";
import { PersonaBento } from "@/components/landing/persona-bento";
import { MachineShowcase } from "@/components/landing/machine-showcase";
import { BlockchainPassport } from "@/components/landing/blockchain-passport";
import { TeamSection } from "@/components/landing/team-section";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <KineticGrid globalColor="monochrome" className="bg-black text-white selection:bg-white selection:text-black">
      <div className="relative min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <LivePreview />
          <PersonaBento />
          <MachineShowcase />
          <BlockchainPassport />
          <TeamSection />
          <Testimonials />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </KineticGrid>
  );
}
