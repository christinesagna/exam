const VARIANTS = {
  primary:   "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300",
  secondary: "bg-gray-500 hover:bg-gray-600 text-white disabled:bg-gray-100",
  danger:    "bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300",
  ghost:     "bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 disabled:text-gray-300",
};

const SIZES = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed
        `+VARIANTS[variant]+` `+SIZES[size]+` `+className+`
      `}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
