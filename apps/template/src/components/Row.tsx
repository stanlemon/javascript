import React from "react";

export function Row({
  as = "div",
  children,
}: {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}) {
  return React.createElement(
    as,
    {
      style: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
      },
    },
    children
  );
}

export default Row;
