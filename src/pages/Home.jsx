import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import FeaturedProjects from "../components/sections/FeaturedProjects";
import Showcase from "../components/sections/Showcase";
import Education from "../components/sections/Education";
import Contact from "../components/sections/Contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Showcase />
      <FeaturedProjects />
      <Education />
      <Contact />
    </div>
  );
}
