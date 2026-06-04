const SIZES = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

const VARIANTS = {
  page:   "min-h-screen flex items-center justify-center bg-gray-50",
  inline: "flex items-center justify-center py-8",
  button: "flex items-center justify-center",
};

export default function Loader({ size = "md", variant = "inline", text }) {
  return (
    <div className={VARIANTS[variant]}>
      <div className="flex flex-col items-center gap-3">

        {/* Spinner */}
        <div className={`
          animate-spin rounded-full
          border-gray-200 border-t-blue-600
          ${SIZES[size]}
        `} />
      </div>
    </div>
  );
}