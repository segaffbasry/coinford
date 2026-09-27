import About from "@/components/home/About";
import Advantage from "@/components/home/Advantage";
import Clients from "@/components/home/Clients";
import Expertise from "@/components/home/Expertise";
import Hero from "@/components/home/Hero";
import Journey from "@/components/home/Journey";
import People from "@/components/home/People";
import ProjectStrip from "@/components/home/ProjectStrip";

/* Homepage order follows hauze.pt's rhythm: hero and media, about, services, captioned strip, advantage accordion,
   then Coinford's own milestones, people and clients. */
export default function Home() {
  return <>
    <Hero />
    <About />
    <Expertise />
    <ProjectStrip />
    <Advantage />
    <Journey />
    <People />
    <Clients />
  </>;
}
