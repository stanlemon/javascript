export function ErrorMessage({ error }: { error: string | boolean }) {
  if (error) {
    return (
      <p>
        <strong>An error has occurred:</strong> {error}
      </p>
    );
  }
  return <></>;
}

export default ErrorMessage;
