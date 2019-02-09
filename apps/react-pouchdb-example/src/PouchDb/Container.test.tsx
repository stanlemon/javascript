import React from "react";
import { mount } from "enzyme";
import { Container } from "./Container";

test("<Container/> renders children", (): void => {
  const text = "Hello World";
  const wrapper = mount(
    <Container>
      <h1>{text}</h1>
    </Container>
  );

  expect(wrapper.props().database).toBe(Container.defaultProps.database);

  expect(wrapper.children().length).toBe(1);

  expect(wrapper.children().contains(text)).toBe(true);
});
