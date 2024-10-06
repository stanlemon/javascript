import React, { createElement } from "react";

export function Row({
  as = "div",
  children,
}: {
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}) {
  return createElement(
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
