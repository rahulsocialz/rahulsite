import { Hero } from "@/components/home/Hero";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { Accolades } from "@/components/home/Accolades";
import { About } from "@/components/home/About";
import { Instagram } from "@/components/home/Instagram";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWorks />
      <div id="awards" className="scroll-mt-24" />
      <Accolades />
      <About />
      <Instagram />
      <Contact />
    </>
  );
}
