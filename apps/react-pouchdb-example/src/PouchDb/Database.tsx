import * as React from "react";
import PouchDB from "pouchdb";

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
    id: string,
    component: React.ReactInstance,
    callback: (data: {}) => void
  ): void;
}

interface Doc {
  [key: string]: string;
  _id: string;
  _rev: string;
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
    // Id of the document to be watched
    id: string;
    // <Document /> component instance
    component: React.ReactInstance;
    // Callback on the <Document /> instance that allows us to setState() from here
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
        .on("change", (change: PouchDB.Core.ChangesResponseChange<Doc>) => {
          console.log("Received change", change);
          this.watching.forEach(watch => {
            if (watch.id === change.id) {
              const data = this.extractDocument(change.doc);
              watch.callback(data);
            }
          });
        });
    }
  }

  /**
   * Given a document from PouchDB extract the _id and _rev fields from it.
   * @param doc pouchdb document
   */
  private extractDocument(doc: Doc): {} {
    const data = Object.keys(doc)
      // Create a new key set that excludes these two keys
      .filter(k => k !== "_id" && k !== "_rev")
      // Create a new object using the keyset and the original values
      // Note that the [key]: string type here basically states that every key on the object is a string
      .reduce((obj: { [key: string]: string }, key: string): {
        [key: string]: string;
      } => {
        obj[key] = doc[key];
        return obj;
      }, {});

    return data;
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
        id: string,
        component: React.ReactInstance,
        callback: (data: {}) => void
      ) => {
        console.log("Watching new document  = " + id);
        this.watching.push({ id, component, callback });
        console.log(
          "Currently watching these documents " +
            JSON.stringify(this.watching.map(e => e.id))
        );
      }
    };

    return (
      <Context.Provider value={value}>{this.props.children}</Context.Provider>
    );
  }
}

export default Database;
