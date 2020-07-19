import * as React from "react";
import { Document, PuttableProps } from "@stanlemon/react-pouchdb";
import {
  Row,
  addRow,
  removeRow,
  removeRowById,
  updateRow,
} from "./DocumentHelpers";

type Props = PuttableProps & {
  id: string;
  children: React.ReactElement;
  rows?: Row[];
};

class Wrapper extends React.Component<Props> {
  static defaultProps: Partial<Props> = {};

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
    return React.cloneElement(this.props.children, {
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
}: {
  id: string;
  children: React.ReactElement;
}): React.ReactNode {
  return (
    <Document id={id}>
      <Wrapper id={id}>{children}</Wrapper>
    </Document>
  );
}
