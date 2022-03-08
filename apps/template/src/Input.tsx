export default function Input({
  type = "text",
  value = "",
  label,
  placeholder,
  onChange = () => {
    /* noop */
  },
  onEnter = () => {
    /* noop */
  },
  error,
}: {
  type?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  error?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.currentTarget.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <>
      {label && <label>{label}</label>}
      <input
        type={type}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        value={value}
      />
      {error && <div>{error}</div>}
    </>
  );
}
