import { memo } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import Container from "../layout/Container";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import skillsData from "../../data/skills.json";

// ── Category icon map ────────────────────────────────────────────────────────

const categoryIcons = {
  gamepad: (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
      <circle cx="15" cy="13" r="0.5" fill="currentColor" /><circle cx="17" cy="11" r="0.5" fill="currentColor" />
      <path d="M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
    </svg>
  ),
  box: (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  globe: (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  tool: (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
};

// ── Main section ─────────────────────────────────────────────────────────────

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-20 lg:py-32 bg-[#000000]"
    >
      {/* Section divider */}
      <div
        aria-hidden="true"
        className="w-full border-t border-[rgba(225,220,201,0.06)] mb-20 lg:mb-32"
      />

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionTitle
            label="Expertise"
            title="Skills"
            subtitle="Tools and technologies I work with across game development, 3D art, and the web."
            align="left"
          />
        </motion.div>

        {/* Category grid — 2-col on lg */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {skillsData.map((category, catIndex) => (
            <CategoryCard
              key={category.category}
              category={category}
              catIndex={catIndex}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

// ── Category card ─────────────────────────────────────────────────────────────

const CategoryCard = memo(function CategoryCard({ category, catIndex }) {
  // Each card observes itself — bars only animate when that card is visible
  const [cardRef, isInView] = useIntersectionObserver(
    { threshold: 0.25, rootMargin: "0px 0px -60px 0px" },
    true
  );

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: catIndex * 0.1 }}
      className="bg-[#1F150C] border border-[rgba(225,220,201,0.12)] rounded-2xl p-6 hover:border-[rgba(225,220,201,0.22)] transition-colors duration-300"
    >
      {/* Card header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-lg bg-[#412D15]/50 border border-[rgba(225,220,201,0.12)] flex items-center justify-center text-[#E1DCC9]/50">
          {categoryIcons[category.icon] ?? categoryIcons.tool}
        </span>
        <h3 className="text-sm font-semibold tracking-[0.06em] text-[#E1DCC9]/60 font-[Inter] uppercase">
          {category.category}
        </h3>
      </div>

      {/* Skill bars */}
      <ul className="flex flex-col gap-4">
        {category.skills.map((skill, skillIndex) => (
          <SkillBar
            key={skill.name}
            skill={skill}
            index={skillIndex}
            animate={isInView}
          />
        ))}
      </ul>
    </motion.div>
  );
});

// ── Skill bar row ─────────────────────────────────────────────────────────────

const SkillBar = memo(function SkillBar({ skill, index, animate }) {
  return (
    <li className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#E1DCC9]/70 font-[Inter]">
          {skill.name}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={animate ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.07 + 0.2 }}
          className="text-xs font-mono text-[#E1DCC9]/25"
          aria-label={`${skill.level}%`}
        >
          {skill.level}%
        </motion.span>
      </div>

      {/* Track */}
      <div
        className="relative h-1 w-full rounded-full bg-[rgba(225,220,201,0.06)] overflow-hidden"
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={skill.name}
      >
        {/* Fill bar — only animates once card is in view */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(225,220,201,0.5) 0%, rgba(225,220,201,0.85) 100%)`,
          }}
          initial={{ width: "0%" }}
          animate={animate ? { width: `${skill.level}%` } : { width: "0%" }}
          transition={{
            duration: 0.8,
            delay: index * 0.07 + 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        {/* Shimmer on the leading edge */}
        {animate && (
          <motion.div
            className="absolute inset-y-0 w-6 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(225,220,201,0.4), transparent)",
            }}
            initial={{ left: "0%" }}
            animate={{ left: `${skill.level - 2}%` }}
            transition={{
              duration: 0.8,
              delay: index * 0.07 + 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        )}
      </div>
    </li>
  );
});
