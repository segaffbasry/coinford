import { CropButton, Label, Photo } from "@/components/ui";
import { pages } from "@/lib/content";

const about = pages.about;

/* hauze.pt's "About Us": a statement heading, three short columns, then two photographs side by side. */
export default function About() {
  const columns = [
    { title: "Who we are", body: about.intro[0] },
    { title: "Since 1990", body: about.intro[2] },
    { title: "Our mission", body: about.mission[0] },
  ];
  return <section className="section home-about" aria-labelledby="about-title">
    <div className="wrap">
      <Label>About Us</Label>
      <h2 className="h2 home-about-title" id="about-title" data-reveal="heading">{about.title}. {about.intro[1]}</h2>
      <div className="home-about-cols">{columns.map((c) => <div key={c.title} data-reveal="card"><h3 className="eyebrow">{c.title}</h3><p className="body">{c.body}</p></div>)}</div>
      <div className="home-about-media">
        <Photo media={about.hero} sizes="(max-width: 900px) 100vw, 60vw" parallax className="home-about-wide" />
        <div className="home-about-side">
          <Photo media={pages.home.expertise} sizes="(max-width: 900px) 100vw, 40vw" parallax />
          <p className="body" data-reveal="text">{about.intro[3]}</p>
          <CropButton href="/about">About Coinford</CropButton>
        </div>
      </div>
    </div>
  </section>;
}
