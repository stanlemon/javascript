import React from "react";

export function ErrorMessage({ error }: { error }) {
  if (error) {
    return (
      <p style={{ color: "red" }}>
        <strong>An error has occurred:</strong> {error}
      </p>
    );
  }
  return <></>;
}

export default ErrorMessage;
