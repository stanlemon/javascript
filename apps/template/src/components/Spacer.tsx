import React from "react";

export function Spacer({ height = "2em" }: { height?: string | number }) {
  return <div style={{ height, minHeight: height }} />;
}

export default Spacer;
