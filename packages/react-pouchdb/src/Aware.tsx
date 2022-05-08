import * as React from "react";

import { DatabaseContext } from "./Database";

interface Props {
  children: React.ReactElement;
}

export class Aware extends React.Component<Props> {
  static contextType = DatabaseContext;
  declare context: React.ContextType<typeof DatabaseContext>;

  render(): React.ReactNode {
    const db = this.context?.db;

    if (React.isValidElement(this.props.children)) {
      return React.cloneElement(
        this.props.children as React.ReactElement<{ db: PouchDB.Database }>,
        { db }
      );
    }

    throw new Error("A valid child component must be provided");
  }
}

export default Aware;
