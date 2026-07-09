import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import FeaturedProjects from "../components/sections/FeaturedProjects";
import Showcase from "../components/sections/Showcase";
import GameplayVideos from "../components/sections/GameplayVideos";
import TechnicalBreakdown from "../components/sections/TechnicalBreakdown";
// import Skills from "../components/sections/Skills";
import Education from "../components/sections/Education";
import Contact from "../components/sections/Contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <FeaturedProjects />
      <Showcase />
      <GameplayVideos />
      <TechnicalBreakdown />
      {/* <Skills /> */}
      <Education />
      <Contact />
    </div>
  );
}
