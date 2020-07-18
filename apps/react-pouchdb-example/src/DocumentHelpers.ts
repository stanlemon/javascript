import { v4 as uuid } from "uuid";
import { formatISO } from "date-fns";

export interface Row {
  id: string;
  [propName: string]: unknown;
}

export function addRow(rows: Row[], row: Omit<Row, "id">): Row[] {
  const now = formatISO(new Date());
  return [...rows, { ...row, id: uuid(), created: now, lastUpdated: now }];
}

export function removeRow(rows: Row[], row: Row): Row[] {
  return removeRowById(rows, row.id);
}

export function removeRowById(rows: Row[], id: string): Row[] {
  return rows.filter((r) => r.id !== id);
}

export function updateRow(rows: Row[], row: Row, partial = true): Row[] {
  const lastUpdated = formatISO(new Date());
  return rows.map((r) => {
    if (r.id === row.id) {
      return {
        ...(partial ? r : {}),
        ...row,
        id: r.id,
        created: r.created,
        lastUpdated,
      };
    }
    return r;
  });
}
