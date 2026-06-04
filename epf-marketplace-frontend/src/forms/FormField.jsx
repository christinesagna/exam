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
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className="form-input"
        aria-invalid={Boolean(error)}
      />
      {error?.message && <p className="field-error">{error.message}</p>}
    </div>
  );
}
