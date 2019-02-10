import * as React from "react";
import PouchDB from "pouchdb";
import { omit } from "lodash";

export const Context = React.createContext(null);

interface DatabaseProps {
  children: React.ReactNode;

  /**
   * (Optional) Name or instance of the local PouchDB instance.
   *
   * Normally you just specify a name such as 'local' or 'test', but for unusual circumstances you can pass along an
   * existing PouchDB instance.
   *
   * Defaults to 'local' if not specified.
   */
  database?: string | PouchDB.Database;

  /**
   * (Optional) URL or instance of a remote CouchDB compatible database to synchronize with.
   */
  remote?: string | PouchDB.Database;
}

export interface DatabaseContext {
  db: PouchDB.Database;
  watchDocument(
    document: string,
    component: React.ReactInstance,
    callback: (data: {}) => void
  ): void;
}

/**
 * Component for using PouchDB with React components. In order to wrap a component in a <Document />
 * you need to use this component upstream of it.
 */
export class Database extends React.Component<DatabaseProps> {
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

  constructor(props: DatabaseProps) {
    super(props);

    // Create our new local database
    this.db =
      props.database instanceof PouchDB
        ? props.database
        : new PouchDB(props.database as string);

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
      this.changes.cancel();
      this.watching = [];
    }
  }

  render(): React.ReactNode {
    const value: DatabaseContext = {
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

export default Database;
