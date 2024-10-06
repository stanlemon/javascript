import React, { createElement } from "react";

export function Column({
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
        flexDirection: "column",
        flexBasis: "100%",
        flex: "1 1 0",
      },
    },
    children
  );
}

export default Column;
