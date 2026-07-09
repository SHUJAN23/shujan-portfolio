import AboutSection from "../components/sections/About";
import Education from "../components/sections/Education";
import Contact from "../components/sections/Contact";

export default function About() {
  return (
    <div style={{ paddingTop: "96px" }} className="min-h-screen">
      <AboutSection />
      <Education />
      <Contact />
    </div>
  );
}
