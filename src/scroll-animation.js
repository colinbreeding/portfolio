// Scroll Animation
const sr = ScrollReveal({
  distance: "60px",
  duration: 2800,
  reset: true,
});

sr.reveal(
  `.home__container,.skills__container, .qualification__container, .portfolio__container, .testimonial__container`,
  {
    origin: "top",
    interval: 100,
  }
);
