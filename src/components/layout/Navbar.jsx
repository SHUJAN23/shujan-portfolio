import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/games" },
  { name: "Asset Library", path: "/models" },
  { name: "About", path: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`
          sticky top-0 left-0 right-0 z-50 h-16 
          border-b border-[rgba(225,220,201,0.15)]
          transition-all duration-300
          ${
            scrolled
              ? "bg-[#000000]/80 backdrop-blur-lg"
              : "bg-[#000000]/40 backdrop-blur-sm"
          }
        `}
      >
        <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-[#E1DCC9] font-[Space_Grotesk] tracking-tight hover:text-[#E1DCC9]/80 transition-colors"
          >
            SHUJAN
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-[Inter] font-medium transition-colors relative group ${
                      isActive ? "text-[#E1DCC9]" : "text-[#E1DCC9]/60"
                    } hover:text-[#E1DCC9]`
                  }
                >
                  {link.name}
                  {/* Active indicator */}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#E1DCC9] transition-all duration-300 group-hover:w-full" />
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Resume Button */}
          <div className="hidden md:block">
            <Button
              as="a"
              href="/resume.pdf"
              variant="outline"
              size="sm"
              external
            >
              Resume
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-[#E1DCC9] transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[#E1DCC9] transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[#E1DCC9] transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-full max-w-sm bg-[#1F150C] border-l border-[rgba(225,220,201,0.15)] z-40 md:hidden overflow-y-auto"
            >
              <nav className="flex flex-col p-6 gap-6">
                {/* Mobile Links */}
                <ul className="flex flex-col gap-4">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block text-lg font-[Inter] font-medium py-2 transition-colors ${
                            isActive ? "text-[#E1DCC9]" : "text-[#E1DCC9]/60"
                          } hover:text-[#E1DCC9]`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>

                {/* Mobile Resume Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 border-t border-[rgba(225,220,201,0.15)]"
                >
                  <Button
                    as="a"
                    href="/resume.pdf"
                    variant="primary"
                    size="md"
                    external
                    className="w-full"
                  >
                    Download Resume
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
