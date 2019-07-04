import uuidv1 from "uuid/v1";

interface Row {
  id: string;
  [propName: string]: any;
}

export function addRow(rows: Row[], row: Omit<Row, "id">) {
  return [...rows, { id: uuidv1(), ...row }];
}

export function removeRow(rows: Row[], row: Row) {
  return rows.filter(r => r.id !== row.id);
}

export function removeRowById(rows: Row[], id: string) {
  return rows.filter(r => r.id !== id);
}

export function updateRow(rows: Row[], row: Row) {
  return rows.map(r => {
    if (r.id === row.id) {
      return { ...r, ...row };
    }
    return r;
  });
}

export function updatePartialRow(rows: Row[], id: string, row: {}) {
  return rows.map(r => {
    if (r.id === id) {
      return { ...r, ...row };
    }
    return r;
  });
}
