import React from "react";

export const MultilineText = ({
  text,
}: {
  text: string;
}): React.ReactElement[] =>
  text
    .split("\n\n")
    .map((line: string, index: number) => <p key={index}>{line}</p>);
