import React from "react";
import PouchDB from "pouchdb";
import { mount } from "enzyme";
import { Container } from "./Container";
import { withDocument, PuttableProps } from "./Document";

class TestComponent extends React.Component<
  PuttableProps & { value?: string }
> {
  static defaultProps = {
    value: "Hello World"
  };
  render(): React.ReactNode {
    return <div>{this.props.value}</div>;
  }
}

function Loading(): React.ReactElement<any> {
  return <div>Loading...</div>;
}

test("withDocument() renders children", async (): Promise<void> => {
  const db = new PouchDB("local");
  // Delete our document if it already exists
  try {
    const doc = await db.get("test");
    await db.remove(doc);
  } catch (e) {
    // Nothing to do here
  }

  await db.put({ _id: "test", value: "Hello World" });

  const Test = withDocument("test", TestComponent);

  const wrapper = mount(
    <Container>
      <Test loading={<Loading />} />
    </Container>
  );

  expect(wrapper.find(Loading).length).toBe(1);
});
