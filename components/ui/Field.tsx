/* Minimal underline form field, editorial styling. Label sits above; the
   line warms to the accent colour on focus. */
export function Field({
  label,
  name,
  type = "text",
  textarea = false,
  required = false,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = `field-${name}`;
  const cls =
    "w-full border-b hairline bg-transparent pb-3 pt-1 text-[0.95rem] outline-none transition-colors duration-300 placeholder:text-muted/50 focus:border-[var(--accent)]";
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-3 block">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={4}
          placeholder={placeholder}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}
