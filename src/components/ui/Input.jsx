export default function Input({ type = "text", placeholder = "", value, onChange, className = "" }) {
  return (
    <div className="flex flex-col gap-1 w-full">

      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Wrapper input + icônes */}
      <div className="relative flex items-center">

        {/* Icône gauche */}
        {iconLeft && (
          <span className="absolute left-3 text-gray-400">
            {iconLeft}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-lg border px-4 py-2 text-sm
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400
            ${error
              ? "border-red-500 bg-red-50 text-red-900 placeholder-red-300"
              : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
            }
            ${iconLeft  ? "pl-10" : ""}
            ${iconRight ? "pr-10" : ""}
            ${className}
          `}
          {...rest}
        />

        {/* Icône droite */}
        {iconRight && (
          <span className="absolute right-3 text-gray-400">
            {iconRight}
          </span>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

    </div>
  );
}