"use client";

import { useRef, useState } from "react";

/* The HSQE training film plays only on request, with sound and native controls once started. */
export default function TrainingFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  return <figure className="photo training-film" data-reveal="image">
    <video ref={ref} src="/media/film/training.mp4" poster="/media/film/training-poster.jpg" preload="none" playsInline controls={started}
      aria-label="Coinford training film" onPlay={() => setStarted(true)} />
    {!started && <button className="film-toggle label" onClick={() => { setStarted(true); ref.current?.play(); }}><span className="film-icon" aria-hidden="true"><b /></span>Play training film</button>}
  </figure>;
}
