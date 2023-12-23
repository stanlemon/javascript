import React from "react";
export interface Props
  // Inherit everything from input except onChange which we simplify here
  extends Omit<React.ComponentPropsWithRef<"input">, "onChange"> {
  type?: string;
  name: string;
  value?: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  error?: string;
}

export function Input({
  type = "text",
  name,
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
  ...attrs
}: Props) {
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
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        value={value}
        {...attrs}
      />
      {error && <div>{error}</div>}
    </>
  );
}

export default Input;
