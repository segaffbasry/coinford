/* One easing family for the whole site. The CSS twins live in app/globals.css as --ease-* custom properties. */

// harrowservice.com appear animations: { duration: .4, ease: [.35, 0, .25, 1], y: 8 } (from __framer__appearAnimationsContent).
export const EASE = "0.35,0,0.25,1";
// harrowservice.com hover transitions: { duration: .2, ease: [.44, 0, .56, 1] }.
export const EASE_HOVER = "0.44,0,0.56,1";

export const timing = {
  // Harrow's 0.4s appear, stretched for larger moves and shortened in late ([data-late]) sections.
  label: 0.4,
  heading: 0.7,
  text: 0.6,
  card: 0.6,
  image: 1.0,
  late: 0.72, // multiplier for sections marked data-late
};
