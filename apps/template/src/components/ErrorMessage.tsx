export function ErrorMessage({
  error,
}: {
  error: string | boolean | undefined | null;
}) {
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
