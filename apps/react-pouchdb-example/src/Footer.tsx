import * as React from "react";

export function Footer(): JSX.Element {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          Created by <a href="http://stanlemon.net">Stan Lemon</a> using{" "}
          <a href="https://github.com/stanlemon/react-pouchdb">React PouchDB</a>{" "}
          &amp;{" "}
          <a href="https://github.com/stanlemon/react-couchdb-authentication">
            React CouchDB Authentication
          </a>{" "}
          components.
        </p>
      </div>
    </footer>
  );
}
