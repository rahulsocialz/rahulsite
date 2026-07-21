/* Mono-labelled underline field. The rule darkens on focus, and the field
   only flags as invalid via :user-invalid — after the visitor has actually
   interacted with it, not on first paint. */
export function Field({
  label,
  name,
  type = "text",
  textarea = false,
  select = false,
  options = [],
  required = false,
  autoComplete,
  placeholder,
  rows = 3,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  select?: boolean;
  options?: string[];
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const id = `field-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="label mb-2 block text-[var(--muted)]">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className="field-input resize-none"
        />
      ) : select ? (
        <select id={id} name={name} required={required} defaultValue="" className="field-input">
          <option value="" disabled>
            {placeholder ?? "Select"}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="field-input"
        />
      )}
    </div>
  );
}
