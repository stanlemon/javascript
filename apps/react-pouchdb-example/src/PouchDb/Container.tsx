import * as React from "react";
import PouchDB from "pouchdb";

export const Context = React.createContext(null);

interface ContainerProps {
  children: React.ReactNode;

  /**
   * Name of the local PouchDB database.
   *
   * Defaults to 'local' if not specified.
   */
  database?: string;

  /**
   * (Optional) URL of a remote CouchDB compatible database to synchronize with.
   */
  remote?: string;
}

/**
 * Container for using PouchDB with React components. In order to wrap a component in a <Document />
 * you need to use this component upstream of it.
 */
export class Container extends React.Component<ContainerProps> {
  private db: PouchDB.Database;

  private sync: PouchDB.Replication.Sync<{}>;

  static defaultProps = {
    database: "local"
  };

  constructor(props: ContainerProps) {
    super(props);

    // Create our new local database
    this.db = new PouchDB(props.database);
    // Replicate to a remote database
    if (props.remote) {
      this.sync = this.db.sync(props.remote, { live: true });
    }
  }

  componentWillUnmount(): void {
    if (this.props.remote) {
      this.sync.cancel();
    }
  }

  render(): React.ReactNode {
    return (
      <Context.Provider value={this.db}>{this.props.children}</Context.Provider>
    );
  }
}

export default Container;
