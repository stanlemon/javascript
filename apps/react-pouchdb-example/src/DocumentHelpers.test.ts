import {
  addRow,
  removeRow,
  removeRowById,
  updateRow,
  updatePartialRow,
} from "./DocumentHelpers";

test("addRows()", () => {
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

test("removeRow()", () => {
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

test("removeRowById()", () => {
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

test("updateRow()", () => {
  expect(
    updateRow(
      [
        { id: "1", foo: "foo" },
        { id: "2", bar: "bar" },
      ],
      { id: "2", bar: "baz" }
    )
  ).toEqual([
    { id: "1", foo: "foo" },
    { id: "2", bar: "baz" },
  ]);
});

test("updatePartialRow()", () => {
  expect(
    updatePartialRow(
      [
        { id: "1", foo: "foo" },
        { id: "2", bar: "bar" },
      ],
      "2",
      { baz: "baz" }
    )
  ).toEqual([
    { id: "1", foo: "foo" },
    { id: "2", bar: "bar", baz: "baz" },
  ]);
});
