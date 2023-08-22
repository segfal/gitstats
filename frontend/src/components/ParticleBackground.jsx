import Particles from "react-tsparticles";
import { useCallback } from "react";

//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        particles: {
          number: {
            value: 24,
            density: { enable: true, value_area: 4890.406785639845 },
          },
          color: { value: "#7f5af0" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#7f5af0" },
            polygon: { nb_sides: 6 },
            image: { src: "img/github.svg", width: 100, height: 100 },
          },
          opacity: {
            value: 0.48102361825965684,
            random: true,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
          },
          size: {
            value: 52.110891978129494,
            random: false,
            anim: { enable: true, speed: 10, size_min: 40, sync: false },
          },
          line_linked: {
            enable: false,
            distance: 200,
            color: "#ffffff",
            opacity: 0.2966312312601217,
            width: 2,
          },
          move: {
            enable: true,
            speed: 8,
            direction: "right",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false, mode: "grab" },
            onclick: { enable: false, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: true,
      }}
    />
  );
};

export default ParticleBackground;
