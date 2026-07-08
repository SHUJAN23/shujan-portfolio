import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import FeaturedProjects from "../components/sections/FeaturedProjects";
import Showcase from "../components/sections/Showcase";
import GameplayVideos from "../components/sections/GameplayVideos";
import TechnicalBreakdown from "../components/sections/TechnicalBreakdown";
// import Skills from "../components/sections/Skills"; // commented out — moved to future dedicated page
import Resume from "../components/sections/Resume";
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
      <Resume />
      <Contact />
    </div>
  );
}
