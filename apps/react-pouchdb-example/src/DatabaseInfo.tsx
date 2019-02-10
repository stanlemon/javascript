import * as React from "react";
import PouchDB from "pouchdb";

export class DatabaseInfo extends React.Component<
  { db?: PouchDB.Database },
  { count: number }
> {
  componentDidMount(): void {
    this.props.db.info().then(info => {
      this.setState({ count: info.doc_count });
    });
  }

  render(): React.ReactNode {
    // If there is no state or if count is not set
    if (!this.state || undefined === this.state.count || !this.state.count) {
      return <React.Fragment />;
    }

    return <div>Number of docs = {this.state.count}</div>;
  }
}
