import AboutSection from "../components/sections/About";
import Education from "../components/sections/Education";
import Contact from "../components/sections/Contact";

export default function About() {
  return (
    <div className="min-h-screen">
      <AboutSection />
      <Education />
      <Contact />
    </div>
  );
}
