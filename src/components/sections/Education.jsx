import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import Container from "../layout/Container";

// ── Data ──────────────────────────────────────────────────────────────────────

const education = [
  {
    id: "mca",
    degree: "Master of Computer Applications (MCA)",
    institution: "NMAMIT Nitte College",
    period: "2024 — Present",
  },
  {
    id: "bca",
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "SDM College, Mangalore",
    period: "2021 — 2024",
  },
];

// type: "pdf" → renders <iframe>  |  type: "image" → renders <img>
const certifications = [
  {
    id: "cert-1",
    title: "Unity 3D Game Development Internship Certificate",
    issuer: "Abhima Technologies",
    file: "/assets/images/certificates/Internship Certificate - Shujan.pdf",
    type: "pdf",
  },
  {
    id: "cert-2",
    title: "C# Unity 3D Mobile Car Racing Game Development",
    issuer: "Udemy",
    file: "/assets/images/certificates/Unity 3d Car Racing Game.pdf",
    type: "pdf",
  },
  {
    id: "cert-3",
    title: "Game Development for Beginners: 3D Car Game in Unity",
    issuer: "Udemy",
    file: "/assets/images/certificates/Unity 3d Car game.pdf",
    type: "pdf",
  },
];

// ── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Main component ────────────────────────────────────────────────────────────

export default function Education() {
  const [activeCert, setActiveCert] = useState(null);

  return (
    <>
      <section
        id="education"
        aria-labelledby="education-heading"
        className="py-20 lg:py-32 bg-[#000000]"
      >
        <div aria-hidden="true" className="w-full border-t border-[rgba(225,220,201,0.06)] mb-20 lg:mb-32" />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <SectionTitle
              label="Background"
              title="Education & Certifications"
              subtitle="Academic foundations and professional courses that shaped my craft."
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* ── Education timeline ── */}
            <div>
              <ColumnHeading icon={<GraduationIcon />} label="Education" />
              <div className="relative mt-6">
                <div
                  aria-hidden="true"
                  className="absolute left-[5px] top-2 bottom-2 w-px bg-[rgba(225,220,201,0.08)]"
                />
                {education.map((item, i) => (
                  <motion.div
                    key={item.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="relative pl-8 pb-10 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[6px] w-[11px] h-[11px] rounded-full bg-[#412D15] border-2 border-[rgba(225,220,201,0.3)]"
                    />
                    <span className="text-[11px] font-mono text-[#E1DCC9]/25 tracking-wider">
                      {item.period}
                    </span>
                    <h4 className="mt-1.5 text-base font-semibold text-[#E1DCC9] font-[Space_Grotesk] leading-snug">
                      {item.degree}
                    </h4>
                    <p className="mt-1 text-sm text-[#E1DCC9]/45 font-[Inter]">
                      {item.institution}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Certifications list ── */}
            <div>
              <ColumnHeading icon={<CertIcon />} label="Certifications" />
              <div className="mt-6 flex flex-col gap-3">
                {certifications.map((cert, i) => (
                  <CertCard
                    key={cert.id}
                    cert={cert}
                    index={i}
                    onOpen={setActiveCert}
                  />
                ))}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Certificate viewer modal */}
      <AnimatePresence>
        {activeCert && (
          <CertViewer cert={activeCert} onClose={() => setActiveCert(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ── CertCard ──────────────────────────────────────────────────────────────────

function CertCard({ cert, index, onOpen }) {
  return (
    <motion.button
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      onClick={() => onOpen(cert)}
      aria-label={`View certificate: ${cert.title}`}
      className="group w-full text-left flex items-start gap-4 p-4 rounded-xl bg-[#1F150C] border border-[rgba(225,220,201,0.1)] hover:border-[rgba(225,220,201,0.3)] transition-all duration-200 cursor-pointer"
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#412D15]/50 border border-[rgba(225,220,201,0.1)] flex items-center justify-center text-[#E1DCC9]/40 mt-0.5 group-hover:text-[#E1DCC9]/70 group-hover:border-[rgba(225,220,201,0.25)] transition-colors">
        <AwardIcon />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#E1DCC9]/80 font-[Inter] leading-snug group-hover:text-[#E1DCC9] transition-colors">
          {cert.title}
        </p>
        <p className="text-xs text-[#E1DCC9]/35 font-[Inter] mt-0.5">
          {cert.issuer}
        </p>
      </div>

      {/* View hint on hover */}
      <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-medium text-[#E1DCC9]/0 group-hover:text-[#E1DCC9]/40 transition-colors font-[Inter] self-center">
        View
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>
    </motion.button>
  );
}

// ── CertViewer modal ──────────────────────────────────────────────────────────

function CertViewer({ cert, onClose }) {
  // Encode each path segment so spaces in filenames work as valid URLs
  const safeUrl = cert.file
    ? cert.file.split("/").map((seg) => encodeURIComponent(seg)).join("/")
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate: ${cert.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl bg-[#1F150C] border border-[rgba(225,220,201,0.15)] rounded-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh", minHeight: "320px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(225,220,201,0.08)] flex-shrink-0">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-[#E1DCC9] font-[Space_Grotesk] leading-snug">
              {cert.title}
            </p>
            <p className="text-xs text-[#E1DCC9]/40 font-[Inter]">
              {cert.issuer}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close certificate viewer"
            className="ml-4 w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg border border-[rgba(225,220,201,0.12)] text-[#E1DCC9]/40 hover:text-[#E1DCC9] hover:border-[rgba(225,220,201,0.3)] transition-all cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Certificate content */}
        <div className="flex-1 overflow-hidden bg-[#000000]/30 min-h-[300px]">
          {safeUrl ? (
            cert.type === "pdf" ? (
              <iframe
                src={safeUrl}
                title={cert.title}
                className="w-full h-full border-0 min-h-[300px]"
              />
            ) : (
              <div className="flex items-center justify-center p-4 h-full">
                <img
                  src={safeUrl}
                  alt={`${cert.title} certificate`}
                  className="max-w-full max-h-[65vh] object-contain rounded-lg"
                />
              </div>
            )
          ) : (
            <NoCertPlaceholder />
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[rgba(225,220,201,0.06)] flex-shrink-0">
          <p className="text-[10px] text-[#E1DCC9]/20 font-[Inter] text-center tracking-wide">
            Click anywhere outside or press × to close
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Placeholder ───────────────────────────────────────────────────────────────

function NoCertPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="w-14 h-14 rounded-xl border border-[rgba(225,220,201,0.1)] flex items-center justify-center text-[#E1DCC9]/20">
        <AwardIcon size={24} />
      </div>
      <p className="text-sm text-[#E1DCC9]/35 font-[Inter]">
        Certificate file not found
      </p>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ColumnHeading({ icon, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-7 h-7 rounded-lg bg-[#412D15]/50 border border-[rgba(225,220,201,0.12)] flex items-center justify-center text-[#E1DCC9]/45">
        {icon}
      </span>
      <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-[#E1DCC9]/40 font-[Inter]">
        {label}
      </h3>
    </div>
  );
}

function GraduationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function CertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function AwardIcon({ size = 14 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
