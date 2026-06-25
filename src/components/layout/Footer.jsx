import { Link } from "react-router-dom";
import Container from "./Container";

const navLinks = [
  { name: "Home",          path: "/" },
  { name: "Projects",      path: "/games" },
  { name: "Asset Library", path: "/models" },
  { name: "About",         path: "/about" },
];

const socials = [
  { name: "GitHub",   href: "https://github.com/" },
  { name: "LinkedIn", href: "https://linkedin.com/in/" },
];

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="border-t border-[rgba(225,220,201,0.08)] bg-[#000000]"
    >
      <Container>
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-10">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-1.5">
            <Link
              to="/"
              className="text-lg font-bold text-[#E1DCC9] font-[Space_Grotesk] tracking-tight hover:text-[#E1DCC9]/70 transition-colors"
            >
              SHUJAN
            </Link>
            <p className="text-xs text-[#E1DCC9]/25 font-[Inter]">
              Unity Game Developer · Technical Artist · 3D Artist
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#E1DCC9]/35 hover:text-[#E1DCC9]/70 transition-colors font-[Inter]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[rgba(225,220,201,0.06)]" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-6">
          <p className="text-xs text-[#E1DCC9]/20 font-[Inter]">
            © {year} Shujan. Built with React, Vite & Tailwind CSS.
          </p>

          {/* Social links */}
          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#E1DCC9]/25 hover:text-[#E1DCC9]/60 transition-colors font-[Inter]"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
