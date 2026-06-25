import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import Container from "../layout/Container";

// ── Resume data ───────────────────────────────────────────────────────────────
// Update these entries with your real details

const education = [
  {
    id: "mca",
    degree: "Master of Computer Applications (MCA)",
    institution: "Your University Name",
    period: "2023 — Present",
    description:
      "Specialising in software engineering with a focus on game development, interactive graphics, and applied computing.",
    tags: ["Game Development", "Software Engineering", "3D Graphics"],
  },
  {
    id: "bsc",
    degree: "Bachelor of Science (B.Sc.)",
    institution: "Your University Name",
    period: "2020 — 2023",
    description:
      "Completed undergraduate studies in Computer Science. Developed foundational skills in programming, data structures, and software design.",
    tags: ["Computer Science", "Programming", "Data Structures"],
  },
];

const experience = [
  {
    id: "freelance",
    role: "Freelance Unity Developer & 3D Artist",
    company: "Self-employed",
    period: "2022 — Present",
    description:
      "Designing and developing game prototypes, vehicle assets, and interactive 3D experiences. End-to-end ownership from concept through to optimised build.",
    tags: ["Unity", "C#", "Blender", "Game Design"],
  },
];

// ── Animation helpers ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function Resume() {
  return (
    <section
      id="resume"
      aria-labelledby="resume-heading"
      className="py-20 lg:py-32 bg-[#000000]"
    >
      {/* Section divider */}
      <div
        aria-hidden="true"
        className="w-full border-t border-[rgba(225,220,201,0.06)] mb-20 lg:mb-32"
      />

      <Container>
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle
              label="Background"
              title="Resume"
              subtitle="Education and experience that shaped how I build."
              align="left"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <Button
              as="a"
              href="/resume.pdf"
              variant="outline"
              size="md"
              external
              className="gap-2"
            >
              <DownloadIcon />
              Download PDF
            </Button>
          </motion.div>
        </div>

        {/* Two-column layout on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Education column */}
          <TimelineColumn
            heading="Education"
            icon={<GraduationIcon />}
            items={education}
          />

          {/* Experience column */}
          <TimelineColumn
            heading="Experience"
            icon={<BriefcaseIcon />}
            items={experience}
          />
        </div>
      </Container>
    </section>
  );
}

// ── Timeline column ───────────────────────────────────────────────────────────

function TimelineColumn({ heading, icon, items }) {
  return (
    <div>
      {/* Column heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45 }}
        className="flex items-center gap-2.5 mb-8"
      >
        <span className="w-7 h-7 rounded-lg bg-[#412D15]/50 border border-[rgba(225,220,201,0.12)] flex items-center justify-center text-[#E1DCC9]/45">
          {icon}
        </span>
        <h3 className="text-sm font-semibold tracking-[0.08em] uppercase text-[#E1DCC9]/45 font-[Inter]">
          {heading}
        </h3>
      </motion.div>

      {/* Timeline items */}
      <div className="relative flex flex-col gap-0">
        {/* Vertical line */}
        <div
          aria-hidden="true"
          className="absolute left-[5px] top-3 bottom-3 w-px bg-[rgba(225,220,201,0.08)]"
        />

        {items.map((item, i) => (
          <TimelineItem key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

// ── Timeline item ─────────────────────────────────────────────────────────────

function TimelineItem({ item, index }) {
  const title = item.degree ?? item.role;
  const subtitle = item.institution ?? item.company;

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      {/* Dot */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-[6px] w-[11px] h-[11px] rounded-full bg-[#412D15] border-2 border-[rgba(225,220,201,0.25)]"
      />

      {/* Period */}
      <span className="text-[11px] font-mono text-[#E1DCC9]/25 tracking-wider">
        {item.period}
      </span>

      {/* Title */}
      <h4 className="mt-1.5 text-base font-semibold text-[#E1DCC9] font-[Space_Grotesk] leading-snug">
        {title}
      </h4>

      {/* Subtitle — institution or company */}
      <p className="mt-0.5 text-sm text-[#E1DCC9]/40 font-[Inter]">
        {subtitle}
      </p>

      {/* Description */}
      <p className="mt-3 text-sm text-[#E1DCC9]/50 font-[Inter] leading-relaxed">
        {item.description}
      </p>

      {/* Tags */}
      {item.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] text-[#E1DCC9]/35 border border-[rgba(225,220,201,0.1)] rounded-md font-[Inter]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
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

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12" />
      <path d="M2 12h20" />
    </svg>
  );
}
