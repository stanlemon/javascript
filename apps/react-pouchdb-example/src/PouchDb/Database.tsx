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
  static defaultProps = {
    database: "local"
  };

  private db: PouchDB.Database;

  private sync: PouchDB.Replication.Sync<{}>;

  private changes: PouchDB.Core.Changes<{}>;

  private watching: {
    // Id of the document to be watched
    id: string;
    // <Document /> component instance
    component: React.ReactInstance;
    // Callback on the <Document /> instance that allows us to setState() from here
    setDocument: (data: {}) => void;
  }[] = [];

  constructor(props: DatabaseProps) {
    super(props);

    // Create our new local database
    this.db =
      this.props.database instanceof PouchDB
        ? this.props.database
        : new PouchDB(this.props.database as string);
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

  componentDidMount(): void {
    // Replicate to a remote database
    if (this.props.remote) {
      this.sync = this.db.sync(this.props.remote, { live: true });

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
              watch.setDocument(data);
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
    const value = {
      db: this.db,
      watchDocument: (
        id: string,
        component: React.ReactInstance,
        setDocument: (data: {}) => void
      ) => {
        console.log("Watching new document  = " + id);
        this.watching.push({ id, component, setDocument });
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
