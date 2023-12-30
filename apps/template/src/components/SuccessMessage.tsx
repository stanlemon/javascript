export function SuccessMessage({
  message,
}: {
  message: string | boolean | undefined | null;
}) {
  if (message) {
    return <p style={{ color: "green" }}>{message}</p>;
  }
  return <></>;
}

export default SuccessMessage;
