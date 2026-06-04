export default function FormField({
  label,
  name,
  type = "text",
  placeholder = "",
  register,
  rules = {},
  error,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={
          `w-full rounded-lg border px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-500 bg-red-50 text-red-900 placeholder-red-300" : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
          }`
        }
      />

      {error?.message && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
}
