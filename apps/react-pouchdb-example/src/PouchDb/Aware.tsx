import * as React from "react";

import { Context, DatabaseContext } from "./Database";

interface Props {
  children: React.ReactChild;
}

export class Aware extends React.Component<Props, {}, DatabaseContext> {
  static contextType = Context;

  render(): React.ReactNode {
    const db = this.context.db;

    if (React.isValidElement(this.props.children)) {
      return React.cloneElement(
        this.props.children as React.ReactElement<{ db: PouchDB.Database }>,
        { db }
      );
    }

    throw new Error("A valid child componenet must be provided");
  }
}

export default Aware;
