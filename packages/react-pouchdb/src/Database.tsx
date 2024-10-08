import * as React from "react";
import PouchDB from "pouchdb";
import { Document } from "./Document";

interface DatabaseProps {
  /**
   * Children components.
   */
  children: React.ReactNode;

  /**
   * If debug is enabled there is additional logging to the console.
   */
  debug: boolean;

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

export interface DatabaseContextType {
  db: PouchDB.Database;
  watchDocument(id: string, component: Document): void;
}

export const DatabaseContext = React.createContext<
  DatabaseContextType | undefined
>(undefined);

export type ExistingDoc = PouchDB.Core.ExistingDocument<
  Record<string, unknown>
> &
  PouchDB.Core.GetMeta &
  PouchDB.Core.IdMeta;

export type Doc = PouchDB.Core.Document<Record<string, unknown>> &
  PouchDB.Core.GetMeta &
  PouchDB.Core.IdMeta;

/**
 * Component for using PouchDB with React components. In order to wrap a component in a <Document />
 * you need to use this component upstream of it.
 */
export class Database extends React.Component<DatabaseProps> {
  static defaultProps = {
    debug: false,
    database: "local",
  };

  private db: PouchDB.Database;

  private sync: PouchDB.Replication.Sync<Partial<Doc>> | null = null;

  private changes: PouchDB.Core.Changes<Partial<Doc>> | null = null;

  private watching: {
    // Id of the document to be watched
    id: string;
    // <Document /> component instance
    component: Document;
  }[] = [];

  constructor(props: DatabaseProps) {
    super(props);

    // Create our new local database
    if (
      typeof this.props.database === "object" &&
      (this.props.database.constructor.name === "PouchDB" ||
        props.database instanceof PouchDB)
    ) {
      this.db = this.props.database;
    } else {
      this.db = new PouchDB(this.props.database as string);
    }
  }

  private log(...args: unknown[]): void {
    if (this.props.debug) {
      // eslint-disable-next-line no-console
      console.log.apply(null, args);
    }
  }

  componentDidMount(): void {
    this.setupSync();
  }

  componentDidUpdate(prevProps: DatabaseProps): void {
    // This is to avoid setting up syncing over and over again
    if (prevProps.remote) {
      this.log(
        "Component has been updated, but we already have a remote connection setup."
      );
      return;
    }

    this.setupSync();
  }

  private setupSync(): void {
    if (!this.props.remote) {
      this.log("Remote database is not setup, skipping sync setup");
      return;
    }

    this.log("Setting up remote database for syncing");

    // Replicate to a remote database
    this.sync = this.db.sync(this.props.remote, {
      retry: true,
      live: true,
    });

    this.changes = this.db
      .changes({
        conflicts: true,
        live: true,
        include_docs: true,
      })
      .on("change", (change) => {
        this.log("Received change = ", change);

        this.watching.forEach((watch) => {
          // if (change.deleted === true) { /* handle deletion /* }

          // If this isn't the doc we're looking for, skip over it
          if (watch.id !== change.id) {
            return;
          }

          // If we did not get a doc, skip over it
          if (!change.doc) {
            return;
          }

          if (change.doc._conflicts) {
            // Handle conflict here
            this.db
              // Note: What happens when there is more than one conflict?
              .get(watch.id, { rev: change.doc._conflicts[0] })
              .then((conflict) => {
                watch.component.handleConflict(
                  change.doc as ExistingDoc,
                  conflict as ExistingDoc
                );
              })
              .catch((err) => console.error(err));
          }

          // If we don't have the revision for this change already (meaning it's likely external and not local) apply it
          if (watch.component.getRevision() !== change.doc._rev) {
            watch.component.setRevision(change.doc._rev);
            watch.component.setDocument(change.doc as ExistingDoc);
          }
        });
      });
  }

  private getSync() {
    if (!this.sync) {
      throw new Error("Sync is not setup");
    }
    return this.sync;
  }

  private getChanges() {
    if (!this.changes) {
      throw new Error("Change monitoring is not setup");
    }
    return this.changes;
  }

  componentWillUnmount(): void {
    if (this.props.remote) {
      this.getSync().cancel();
      this.getChanges().cancel();
      this.watching = [];
    }
  }

  render(): React.ReactNode {
    const contextValue: DatabaseContextType = {
      db: this.db,
      watchDocument: (id: string, component: Document) => {
        this.watching.push({ id, component });
      },
    };

    return (
      <DatabaseContext.Provider value={contextValue}>
        {this.props.children}
      </DatabaseContext.Provider>
    );
  }
}

export default Database;
