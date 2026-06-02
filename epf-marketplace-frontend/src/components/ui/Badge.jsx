const VARIANTS = {
  primary: "bg-blue-100 hover:bg-green-600 text-green-800",
  secondary: "bg-gray-500 hover:bg-gray-600 text-white",
  outline: "border border-gray-500 hover:bg-gray-100 text-gray-500",
};

const DOT_SIZES = {
    success: "bg-green-500",
    danger: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    neutral: "bg-gray-500",
    promo: "bg-purple-500",
};

const SIZES = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
};

export default function Badge({ variant = "primary", size = "md", dotSize, children, className="" }) {
  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-medium
        ${VARIANTS[variant] || VARIANTS.primary}
        ${SIZES[size] || SIZES.md}
        ${className}
      `}
    >
      {dotSize && (
        <span className={`w-2 h-2 rounded-full ${DOT_SIZES[dotSize] || DOT_SIZES.neutral} mr-2`} />
      )}
      {children}
    </span>
  );
}
