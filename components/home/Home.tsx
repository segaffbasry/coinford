import About from "@/components/home/About";
import Advantage from "@/components/home/Advantage";
import Clients from "@/components/home/Clients";
import Expertise from "@/components/home/Expertise";
import Hero from "@/components/home/Hero";
import ProjectStrip from "@/components/home/ProjectStrip";
import Testimonials from "@/components/home/Testimonials";

/* Order agreed in review: hero, client base, what we do, then about, projects, testimonials and the advantage accordion. */
export default function Home() {
  return <>
    <Hero />
    <Clients />
    <Expertise />
    <About />
    <ProjectStrip />
    <Testimonials />
    <Advantage />
  </>;
}
