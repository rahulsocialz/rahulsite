import { Hero } from "@/components/home/Hero";
import { Instagram } from "@/components/home/Instagram";
import { PressPreview } from "@/components/home/PressPreview";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <PressPreview />
      <About />
      <Instagram />
      <Contact />
    </>
  );
}
