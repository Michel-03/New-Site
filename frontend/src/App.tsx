import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { ContactSection } from "./components/ContactSection";
import { Hero } from "./components/Hero";
import { IntroLoader } from "./components/IntroLoader";
import { Cortex, Packages, Platform, Process, Services, Testimonial } from "./components/Sections";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export function App() {
  const [packageInterest, setPackageInterest] = useState("Accelerate");

  return (
    <Box minH="100vh" bg="#f6f4f0" color="#1c1612" fontFamily="Manrope, sans-serif">
      <IntroLoader />
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Platform />
        <Process />
        <Cortex />
        <Testimonial />
        <Packages onSelect={setPackageInterest} />
        <ContactSection packageInterest={packageInterest} onPackageChange={setPackageInterest} />
      </main>
      <SiteFooter />
    </Box>
  );
}
