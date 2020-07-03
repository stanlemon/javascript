import { addRow } from "./DocumentHelpers";

test("addRows()", () => {
  expect(addRow([], { foo: "bar" })).toMatchObject([{ foo: "bar" }]);
});
