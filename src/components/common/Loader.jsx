/**
 * Loader — Suspense fallback with minimal workshop aesthetic
 */
export default function Loader({ message = "Loading..." }) {
  return (
    <div
      role="status"
      aria-label={message}
      className="flex flex-col items-center justify-center w-full min-h-[200px] gap-4"
    >
      {/* Animated gear-like spinner */}
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-[rgba(225,220,201,0.1)]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E1DCC9] animate-spin" />
      </div>
      <span className="text-xs tracking-[0.2em] uppercase text-[#E1DCC9]/30 font-[Inter]">
        {message}
      </span>
    </div>
  );
}
