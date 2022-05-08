import * as React from "react";
import {
  Document,
  PuttableProps,
  DocumentProps,
} from "@stanlemon/react-pouchdb";
import {
  Row,
  addRow,
  removeRow,
  removeRowById,
  updateRow,
} from "./DocumentHelpers";

type Props = {
  rows: Row[];
} & PuttableProps & {
    id: string;
    component: React.ReactElement<RowProps>;
    rows: Row[];
  };

export interface RowProps {
  addRow(row: Omit<Row, "id">): void;
  removeRow(row: Row): void;
  removeRowById(id: string): void;
  updateRow(row: Row, partial?: boolean): void;
}

class Wrapper extends React.Component<Props> {
  static defaultProps = {
    rows: [],
  };

  #addRow = (row: Omit<Row, "id">): void => {
    this.props.putDocument({
      rows: addRow(this.props.rows, row),
    });
  };

  #removeRow = (row: Row): void => {
    this.props.putDocument({
      rows: removeRow(this.props.rows, row),
    });
  };

  #removeRowById = (id: string): void => {
    this.props.putDocument({
      rows: removeRowById(this.props.rows, id),
    });
  };

  #updateRow = (row: Row, partial = true): void => {
    this.props.putDocument({
      rows: updateRow(this.props.rows, row, partial),
    });
  };

  render(): React.ReactElement {
    return React.cloneElement(this.props.component, {
      [this.props.id]: this.props.rows,
      addRow: this.#addRow,
      removeRow: this.#removeRow,
      removeRowById: this.#removeRowById,
      updateRow: this.#updateRow,
    });
  }
}

export function DocumentWithRows({
  id,
  children,
  ...props
}: DocumentProps & {
  id: string;
  children: React.ReactElement<RowProps>;
}): React.ReactElement {
  return (
    <Document id={id} {...props}>
      <Wrapper
        id={id}
        component={children}
        // This will be overriden by <Document />
        putDocument={() => {
          // Empty
        }}
      />
    </Document>
  );
}
