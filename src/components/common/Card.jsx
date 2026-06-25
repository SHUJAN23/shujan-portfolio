/**
 * Card — Base card container with workshop/dark aesthetic
 *
 * @param {boolean} hover - enable hover lift effect
 * @param {string} className - additional classes
 */
export default function Card({ children, hover = true, className = "" }) {
  return (
    <div
      className={`
        bg-[#1F150C] border border-[rgba(225,220,201,0.15)] rounded-xl
        ${hover ? "transition-all duration-300 hover:border-[rgba(225,220,201,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
