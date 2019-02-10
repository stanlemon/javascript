import * as React from "react";
import { omit } from "lodash";
import { Context, ContainerContext } from "./Container";

/**
 * Properties specific to the <Document/> component.
 */
export interface DocumentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
   * If you are using a <Document/> component you should call this.props.putDocument() instead of this.setState().
   *
   * @param data Data to be put in both state and PouchDB.
   */
  putDocument(data: object): void;
}

// eslint-disable-next-line max-lines-per-function
export function withDocument<P>(
  id: string,
  WrappedComponent: React.ComponentType<P & PuttableProps>
): React.ComponentClass<P & DocumentProps> {
  return class extends React.PureComponent<P & DocumentProps, DocumentState> {
    static contextType = Context;

    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    static defaultProps: Partial<P & DocumentProps> = {
      loading: <React.Fragment />
    } as Partial<P & DocumentProps>;

    state = {
      initialized: false,
      data: {}
    };

    private db: PouchDB.Database;

    private setDocument = (data: {} = {}): void => {
      this.setState({
        initialized: true,
        data
      });
    };

    /**
     * Component wrapper, encapsulates a component with PouchDB document management.
     */
    constructor(props: P & DocumentProps, context: ContainerContext) {
      super(props);

      this.db = context.db;

      // Add our current document to the ones we are watching
      context.watchDocument(id, this, this.setDocument);
    }

    componentDidMount(): void {
      this.db
        .get(id)
        .then((doc: {}) => {
          // Update state, but remove these pouchdb specific fields before we do
          const data = omit(doc, ["_id", "_rev"]);

          this.setDocument(data);
        })
        .catch(
          (err: { status: number; message: string; reason: string }): void => {
            // We did not find a document, but the component is now initialized
            // The document can be either 'missing' or 'deleted'
            if (err.status === 404) {
              this.setDocument();
            }
          }
        );
    }

    /**
     * Replacement for setState() in managed components.
     *
     * This method updates state as well as updates the PouchDb document.
     */
    private putDocument = (data: object): void => {
      this.setDocument(data);

      this.db
        .get(id)
        .then((doc: { _id: string; _rev: string }) => {
          // Update the document with our latest data
          return this.db.put({
            _id: doc._id,
            _rev: doc._rev,
            ...data
          });
        })
        .then((doc: {}) => {
          // TODO: We should track the current revision id
          console.log("Result from put", doc);
        })
        .catch(
          (err: { status: number; message: string; reason: string }): void => {
            // This indicates a brand new document that we are creating
            // The document can be either 'missing' or 'deleted'
            if (err.status === 404) {
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
        putDocument: this.putDocument
      };

      return <WrappedComponent {...props} />;
    }
  };
}
