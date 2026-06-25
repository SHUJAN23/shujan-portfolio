/**
 * Button — Reusable button with variants
 * 
 * @param {string} variant - "primary" | "outline" | "ghost"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} as - "button" | "a"
 * @param {boolean} external - open link in new tab
 */

const variants = {
  primary:
    "bg-[#E1DCC9] text-[#000000] hover:bg-[#E1DCC9]/80 font-semibold",
  outline:
    "border border-[rgba(225,220,201,0.4)] text-[#E1DCC9] hover:border-[rgba(225,220,201,0.8)] hover:bg-[rgba(225,220,201,0.05)]",
  ghost:
    "text-[#E1DCC9]/60 hover:text-[#E1DCC9] hover:bg-[rgba(225,220,201,0.05)]",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  as: Tag = "button",
  external = false,
  className = "",
  ...props
}) {
  const externalProps =
    external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Tag
      className={`
        inline-flex items-center justify-center gap-2 rounded-md
        font-[Inter] tracking-wide
        transition-all duration-300 cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...externalProps}
      {...props}
    >
      {children}
    </Tag>
  );
}
