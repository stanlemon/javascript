import * as React from "react";

export function Header({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}): JSX.Element {
  return (
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">{title}</h1>
          <h2 className="subtitle">{subtitle}</h2>
        </div>
      </div>
    </section>
  );
}
