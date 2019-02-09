/* eslint-disable max-lines-per-function */
import React from "react";
import PouchDB from "pouchdb";
import { mount } from "enzyme";
import waitForExpect from "wait-for-expect";
import { Container } from "./Container";
import { withDocument, PuttableProps } from "./Document";

PouchDB.plugin(require("pouchdb-adapter-memory"));

class TestComponent extends React.Component<
  PuttableProps & { value?: string }
> {
  static defaultProps = {
    value: ""
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.putState({ value: e.target.value });
  };

  render(): React.ReactNode {
    return (
      <div>
        <input
          id="value"
          type="text"
          value={this.props.value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

function Loading(): React.FunctionComponentElement<null> {
  return <div>Loading...</div>;
}

async function getPouchDb(): Promise<PouchDB.Database> {
  // An existing database, we'll pass this into our container to be used
  const db = new PouchDB("local", { adapter: "memory" });

  // If the test document exists we're going to delete it before each test
  try {
    const doc = await db.get("test");
    await db.remove(doc);
  } catch (err) {
    // Don't need to do anything
  }

  return db;
}

test("withDocument initializes with no existing document", async (done): Promise<
  void
> => {
  const db = await getPouchDb();

  const Test = withDocument("test", TestComponent);

  const wrapper = mount(
    <Container database={db}>
      <Test loading={<Loading />} />
    </Container>
  );

  // Wait until our component is initialized
  await waitForExpect(() => {
    expect(wrapper.find(Test).state().initialized).toBe(true);
  }, 1000);

  wrapper.unmount();

  done();
});

test("withDocument updates document in PouchDB", async (done): Promise<
  void
> => {
  const db = await getPouchDb();

  const Test = withDocument("test", TestComponent);

  const wrapper = mount(
    <Container database={db}>
      <Test loading={<Loading />} />
    </Container>
  );

  // Wait until our component is initialized
  await waitForExpect(() => {
    expect(wrapper.find(Test).state().initialized).toBe(true);
  }, 3000);

  wrapper.update();

  const input = wrapper.find("input#value");

  expect(input.length).toBe(1);
  expect(input.props().value).toBe("");

  const newValue = "My new value";

  input.simulate("change", { target: { value: newValue } });

  expect(wrapper.find(Test).state().data.value).toBe(newValue);

  wrapper.update();

  await waitForExpect(async () => {
    const doc = await db.get("test");
    expect(doc.value).toBe(newValue);
  }, 1000);

  expect(wrapper.find("input#value").props().value).toBe(newValue);

  wrapper.unmount();

  done();
});

// Note: For some reason if this test runs before the others they fail
test("withDocument renders wrapped component", async (done): Promise<void> => {
  // Add some initial state to our document, this should get loaded into the component
  const db = await getPouchDb();

  await db.put({ _id: "test", value: "Hello World" });

  const Test = withDocument("test", TestComponent);

  const wrapper = mount(
    <Container database={db}>
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
  }, 1000);

  // Force the component to re-render now that it is initialized
  wrapper.update();

  expect(wrapper.find(Loading).length).toBe(0);
  expect(wrapper.find(TestComponent).length).toBe(1);

  wrapper.unmount();

  done();
});
