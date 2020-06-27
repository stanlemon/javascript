import { v1 as uuidv1 } from "uuid";

export interface Row {
  id: string;
  [propName: string]: unknown;
}

export function addRow(rows: Row[], row: Omit<Row, "id">): Row[] {
  return [...rows, { id: uuidv1(), ...row }];
}

export function removeRow(rows: Row[], row: Row): Row[] {
  return rows.filter((r) => r.id !== row.id);
}

export function removeRowById(rows: Row[], id: string): Row[] {
  return rows.filter((r) => r.id !== id);
}

export function updateRow(rows: Row[], row: Row): Row[] {
  return rows.map((r) => {
    if (r.id === row.id) {
      return { ...r, ...row };
    }
    return r;
  });
}

export function updatePartialRow(
  rows: Row[],
  id: string,
  row: Record<string, unknown>
): Row[] {
  return rows.map((r) => {
    if (r.id === id) {
      return { ...r, ...row };
    }
    return r;
  });
}
