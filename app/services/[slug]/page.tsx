import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery, PageHead, Related, RowLink } from "@/components/page";
import { CropButton, Label } from "@/components/ui";
import { serviceSummary, services } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return { title: s?.title };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index]; if (!service) notFound();
  const others = services.filter((s) => s.slug !== slug);
  return <>
    <PageHead label={`Expertise · 0${index + 1}`} title={service.title} lede={service.lede ?? `${service.title}: ${service.list.slice(0, 3).join(", ").toLowerCase()} and more.`} media={service.cover}
      crumbs={[{ label: "Home", href: "/" }, { label: "Expertise", href: "/services" }]} />
    <section className="section" aria-labelledby="scope-title">
      <div className="wrap split-1-2">
        <div className="section-head"><Label>{service.title}</Label><h2 className="h2" id="scope-title" data-reveal="heading">{service.list.length ? "Scope of Works" : "Estimating and planning"}</h2></div>
        <div className="prose">
          {service.list.length > 0 && <ul className="bullets">{service.list.map((item) => <li key={item} data-reveal="card">{item}</li>)}</ul>}
          {service.paragraphs.map((p) => p.includes("@") ? <p key={p} className="body" data-reveal="label"><a className="text-link" href={`mailto:${p}`}>{p}</a></p> : <p key={p} className="body" data-reveal="text">{p}</p>)}
          <div className="prose-cta"><CropButton href="/contact">Discuss a project</CropButton></div>
        </div>
      </div>
    </section>
    <Gallery images={service.images} title={`${service.title} photography`} />
    <Related title="More expertise" href="/services" cta="All expertise">
      <div className="rows">{others.map((s) => <RowLink key={s.slug} href={`/services/${s.slug}`} index={`0${services.indexOf(s) + 1}`} title={s.title} meta={serviceSummary(s)} />)}</div>
    </Related>
  </>;
}
