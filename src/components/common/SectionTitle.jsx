/**
 * SectionTitle — Reusable section heading with optional label
 *
 * @param {string} label - Small uppercase label above the heading
 * @param {string} title - Main heading text
 * @param {string} subtitle - Optional descriptive text below the heading
 * @param {string} align - "left" | "center"
 */
export default function SectionTitle({
  label,
  title,
  subtitle,
  align = "left",
  className = "",
}) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {label && (
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#E1DCC9]/40 font-[Inter]">
          {label}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E1DCC9] font-[Space_Grotesk]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-[#E1DCC9]/50 font-[Inter] max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
