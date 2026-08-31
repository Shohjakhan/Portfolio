import { MainLayout } from "@/layouts/MainLayout";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Achievements } from "@/components/Achievements";
import { Speaking } from "@/components/Speaking";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Achievements />
      <Speaking />
      <Contact />
    </MainLayout>
  );
}
