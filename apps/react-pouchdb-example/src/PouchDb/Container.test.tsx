import React from "react";
import { mount } from "enzyme";
import { Container } from "./Container";

test("<Container/> renders children", (): void => {
  const wrapper = mount(
    <Container>
      <h1>Hello World</h1>
    </Container>
  );

  expect(wrapper.props().database).toBe("local");

  expect(wrapper.children().length).toBe(1);

  expect(wrapper.children().contains("Hello World")).toBe(true);
});
