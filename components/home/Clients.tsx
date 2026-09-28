import Image from "next/image";
import { Ticker } from "@/components/ui";
import sizes from "@/content/client-logos.json";
import { pages } from "@/lib/content";

/* The live "Client Base" carousel as a harrowservice.com ticker. Logos are navy silhouettes (scripts/clients.py). */
export default function Clients() {
  const clients = pages.home.clients.filter((c) => c.logo);
  return <section className="section clients" aria-labelledby="clients-title">
    <div className="wrap"><h2 className="label clients-title" id="clients-title" data-reveal="label">Client Base</h2></div>
    <Ticker label="Coinford clients" seconds={48}>
      {clients.map((c) => {
        const file = c.logo!.src.split("/").pop()!;
        const [width, height] = (sizes as Record<string, number[]>)[file] ?? [c.logo!.width, c.logo!.height];
        return <div className="client" key={c.name}><Image src={`/media/clients/mono/${file}`} alt={c.name} width={width} height={height} sizes="200px" /></div>;
      })}
    </Ticker>
  </section>;
}
