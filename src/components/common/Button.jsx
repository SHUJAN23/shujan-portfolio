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

  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <Tag
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      {...externalProps}
      {...props}
    >
      {children}
    </Tag>
  );
}
