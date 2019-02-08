import * as React from "react";
import { omit } from "lodash";
import { Context } from "./Container";

/**
 * Properties specific to the <Document/> component.
 */
export interface DocumentProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  loading: React.ReactElement<any>;
}

export interface DocumentState {
  data: {};

  initialized: boolean;
}

/**
 * Wrapped components need a put property.
 */
export interface PuttableProps {
  /**
   * Put data into state and the mapped PouchDB document.
   *
   * If you are using a <Document/> component you should call this.props.putState() instead of this.setState().
   *
   * @param data Data to be put in both state and PouchDB.
   */
  putState(data: object): void;
}

/* eslint-disable max-lines-per-function */
export function withDocument<P>(
  id: string,
  WrappedComponent: React.ComponentType<P & PuttableProps>
): React.ComponentClass<P & DocumentProps> {
  return class extends React.Component<P & DocumentProps, DocumentState> {
    static contextType = Context;

    static defaultProps: Partial<P & DocumentProps> = {
      //loading: <React.Fragment />
    };

    state = {
      initialized: false,
      data: {}
    };

    private db: PouchDB.Database;
    private changes: PouchDB.Core.Changes<{}>;

    /**
     * Component wrapper, encapsulates a component with PouchDB document management.
     */
    constructor(props: P & DocumentProps, context: PouchDB.Database) {
      super(props);

      this.db = context;

      // TODO: Evaluate the risk of doing this in multiple components in a single application.
      this.changes = this.db
        .changes({
          since: "now",
          live: true,
          include_docs: true
        })
        .on("change", change => {
          // If a change occurred for our document, update our state
          if (change.id === id) {
            const data = omit(change.doc, ["_id", "_rev"]);
            this.setState({ data });
          }
        });
    }

    componentWillUnmount(): void {
      this.changes.cancel();
    }

    componentDidMount(): void {
      this.db
        .get(id)
        .then((doc: any) => {
          // Update state, but remove these pouchdb specific fields before we do
          const data = omit(doc, ["_id", "_rev"]);

          this.setState({
            initialized: true,
            data
          });
        })
        .catch(err => {
          // We did not find a document, but the component is now initialized
          if (err.status === 404 && err.reason === "missing") {
            this.setState({ initialized: true });
          }
        });
    }

    /**
     * Replacement for setState() in managed components.
     *
     * This method updates state as well as updates the PouchDb document.
     */
    private putState = (data: object): void => {
      this.setState({ data });

      this.db
        .get(id)
        .then((doc: any) => {
          // Update the document with our latest data
          return this.db.put({
            _id: doc._id,
            _rev: doc._rev,
            ...data
          });
        })
        .catch(
          (err: any): void => {
            // This indicates a brand new document that we are creating
            if (err.status === 404 && err.reason === "missing") {
              this.db.put({
                _id: id,
                ...data
              });
            }
          }
        );
    };

    render(): React.ReactNode {
      // If we haven't initialized the document yet, don't return the component
      if (!this.state.initialized) {
        return this.props.loading;
      }

      const props = {
        ...this.props,
        ...this.state.data,
        putState: this.putState
      };

      return <WrappedComponent {...props} />;
    }
  };
}
