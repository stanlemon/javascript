import { formatISO, compareAsc, parseISO } from "date-fns";
import { addRow, removeRow, removeRowById, updateRow } from "./DocumentHelpers";

describe("DocumentHelpers", () => {
  it("addRows()", () => {
    // No rows yet
    expect(addRow([], { foo: "foo" })).toMatchObject([{ foo: "foo" }]);

    // A new row should get an id field
    expect(addRow([], { foo: "foo" })[0].id).toBeDefined();

    // Existing rows
    expect(addRow([{ id: "1", bar: "bar" }], { foo: "foo" })).toMatchObject([
      { id: "1", bar: "bar" },
      { foo: "foo" },
    ]);
  });

  it("removeRow()", () => {
    expect(
      removeRow(
        [
          { id: "1", foo: "foo" },
          { id: "2", bar: "bar" },
        ],
        { id: "2" }
      )
    ).toEqual([{ id: "1", foo: "foo" }]);
  });

  it("removeRowById()", () => {
    expect(
      removeRowById(
        [
          { id: "1", foo: "foo" },
          { id: "2", bar: "bar" },
        ],
        "2"
      )
    ).toEqual([{ id: "1", foo: "foo" }]);
  });

  it("updateRow()", () => {
    const now = new Date();
    const created = formatISO(now);

    const result = updateRow(
      [
        { id: "1", foo: "foo", created, lastUpdated: created },
        { id: "2", bar: "bar", created, lastUpdated: created },
      ],
      { id: "2", bar: "baz" }
    );

    expect(result).toMatchObject([
      { id: "1", foo: "foo", created, lastUpdated: created },
      { id: "2", bar: "baz", created }, // lastUpdated on this should be changed
    ]);

    expect(
      compareAsc(now, parseISO(result[1].lastUpdated as string))
    ).toBeGreaterThanOrEqual(0);
  });

  it("updateRow() non-partial", () => {
    const now = new Date();
    const created = formatISO(now);

    const result = updateRow(
      [{ id: "1", foo: "foo", bar: "bar", created, lastUpdated: created }],
      { id: "1", bar: "baz" },
      false
    );

    expect(result).toMatchObject([{ id: "1", bar: "baz", created }]);

    expect(
      compareAsc(now, parseISO(result[0].lastUpdated as string))
    ).toBeGreaterThanOrEqual(0);
  });
});
