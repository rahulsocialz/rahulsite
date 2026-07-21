import { Hero } from "@/components/home/Hero";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { Instagram } from "@/components/home/Instagram";
import { PressPreview } from "@/components/home/PressPreview";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWorks />
      <Instagram />
      <PressPreview />
      <About />
      <Contact />
    </>
  );
}
