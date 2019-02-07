import React from "react";
import PouchDB from "pouchdb";
import { mount, shallow, render } from "enzyme";
import { Container } from "./Container";
import { Document, PuttableProps } from "./Document";

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

// TODO: What is the correct return type here?
function Loading() {
  return <div>Loading...</div>;
}

test("<Document/> renders children", async (): Promise<any> => {
  const db = new PouchDB("local");
  // Delete our document if it already exists
  try {
    const doc = await db.get("test");
    await db.remove(doc);
  } catch (e) {
    // Nothing to do here
  }

  await db.put({ _id: "test", value: "Hello World" });

  const Test = Document("test", TestComponent);

  const wrapper = mount(
    <Container>
      <Test loading={<Loading />} />
    </Container>
  );

  expect(wrapper.find(Loading).length).toBe(1);
});
