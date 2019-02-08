import React from "react";
import PouchDB from "pouchdb";
import { mount } from "enzyme";
import waitForExpect from "wait-for-expect";
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

function Loading(): React.FunctionComponentElement<null> {
  return <div>Loading...</div>;
}

/* eslint-disable max-lines-per-function */
test("withDocument() renders wrapped component", async (): Promise<void> => {
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

  // The component is not initialized while waiting for PouchDB to fetch its document
  expect(wrapper.find(Test).state().initialized).toBe(false);
  // Uninitialized means that we should have a loading component in the tree
  expect(wrapper.find(Loading).length).toBe(1);
  // And we should not have the component we wrapped
  expect(wrapper.find(TestComponent).length).toBe(0);

  await waitForExpect(() => {
    expect(wrapper.find(Test).state().initialized).toBe(true);
  });

  // Force the component to re-render now that it is initialized
  wrapper.update();

  expect(wrapper.find(Loading).length).toBe(0);
  expect(wrapper.find(TestComponent).length).toBe(1);
});
