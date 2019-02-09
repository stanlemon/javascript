import * as React from "react";
import PouchDB from "pouchdb";
import { omit } from "lodash";

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

export interface ContainerContext {
  db: PouchDB.Database;
  watchDocument(
    document: string,
    component: React.ReactInstance,
    callback: (data: {}) => void
  ): void;
}

/**
 * Container for using PouchDB with React components. In order to wrap a component in a <Document />
 * you need to use this component upstream of it.
 */
export class Container extends React.Component<ContainerProps> {
  private db: PouchDB.Database;

  private sync: PouchDB.Replication.Sync<{}>;

  private changes: PouchDB.Core.Changes<{}>;

  // TODO: Might want to key this by the document name and have an array of components and callbacks
  private watching: {
    document: string;
    component: React.ReactInstance;
    callback: (data: {}) => void;
  }[] = [];

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

      this.changes = this.db
        .changes({
          since: "now",
          live: true,
          include_docs: true
        })
        .on("change", change => {
          console.log("Received change", change);
          this.watching.forEach(watch => {
            if (watch.document === change.id) {
              const data = omit(change.doc, ["_id", "_rev"]);
              watch.callback(data);
            }
          });
        });
    }
  }

  componentWillUnmount(): void {
    if (this.props.remote) {
      this.sync.cancel();
    }
  }

  render(): React.ReactNode {
    const value: ContainerContext = {
      db: this.db,
      watchDocument: (
        document: string,
        component: React.ReactInstance,
        callback: (data: {}) => void
      ) => {
        console.log("Watching new document  = " + document);
        this.watching.push({ document, component, callback });
        console.log(
          "Currently watching these documents " +
            JSON.stringify(this.watching.map(e => e.document))
        );
      }
    };

    return (
      <Context.Provider value={value}>{this.props.children}</Context.Provider>
    );
  }
}

export default Container;
