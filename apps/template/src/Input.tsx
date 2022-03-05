import { useState } from "react";

export default function Input({
  type = "text",
  label,
  placeholder,
  onClick,
}: {
  type: string;
  label: string;
  placeholder: string;
  onClick: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.currentTarget.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    onClick(value);
    setValue("");
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
      <button onClick={handleClick}>Add</button>
    </>
  );
}
