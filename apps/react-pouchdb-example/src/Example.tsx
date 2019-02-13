import * as React from "react";
import { Database, Document, withDocument } from "./PouchDb";
import { Counter } from "./Counter";

/**
 * Example <Counter/> wrapped in PouchDB documents three different ways.
 */
export default function Example(): React.ReactNode {
  const style = { fontFamily: "San Francisco, Helvetica, Arial, sans-serif" };
  const WrappedCounter = withDocument("counter1", Counter);
  return (
    <Database database="local" remote="http://127.0.0.1:5984/test">
      <div style={style}>
        <h1>Example Counter App!</h1>
        <h2>Using a higher order function:</h2>
        <WrappedCounter />
        <h2>Wrapping the component as a child:</h2>
        <Document id="counter2">
          <Counter />
        </Document>
        <h2>Wrapping the component as a property:</h2>
        <Document id="counter3" component={<Counter />} />
      </div>
    </Database>
  );
}
