export default function Container({ children, className = "" }) {
  return (
    <div className={`page-container ${className}`}>
      {children}
    </div>
  );
}
