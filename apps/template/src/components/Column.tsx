import React from "react";

export function Column({
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
        flexDirection: "column",
        flexBasis: "100%",
        flex: "1 1 0",
      },
    },
    children
  );
}

export default Column;
