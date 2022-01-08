import { useState } from "react";

export default function Input({
  onClick,
}: {
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
      <input
        type="text"
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        value={value}
      />
      <button onClick={handleClick}>Add</button>
    </>
  );
}
