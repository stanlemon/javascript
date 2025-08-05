import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  type MockedFunction,
} from "vitest";

import { fetchApi } from "../helpers/fetchApi";
import { SessionAware } from "../Session";

import { Account, PasswordRequest, ProfileForm } from "./";

vi.mock("../helpers/fetchApi");

describe("<Account/>", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("profile updated", async () => {
    const mockedFetchApi = fetchApi as MockedFunction<
      typeof fetchApi<ProfileForm, ProfileForm>
    >;
    mockedFetchApi.mockResolvedValue({
      name: "Jean Luc Picard",
      email: "jeanluc@starfleet.com",
    });

    render(
      <SessionAware>
        <Account />
      </SessionAware>
    );

    expect(screen.getByText('Account for ""')).toBeDefined();
    expect(screen.getByText("Profile")).toBeDefined();
    expect(screen.getByText("Password")).toBeDefined();

    await userEvent.type(screen.getByLabelText("Name"), "Jean Luc Picard");

    fireEvent.click(screen.getByText("Save", { selector: "button" }));

    await waitFor(() => {
      expect(screen.getByText('Account for "Jean Luc Picard"')).toBeDefined();
    });
  });

  it("password changed", async () => {
    const mockedFetchApi = fetchApi as MockedFunction<
      typeof fetchApi<null, PasswordRequest>
    >;
    mockedFetchApi.mockResolvedValue(null);

    render(
      <SessionAware>
        <Account />
      </SessionAware>
    );

    expect(screen.getByText('Account for ""')).toBeDefined();
    expect(screen.getByText("Profile")).toBeDefined();
    expect(screen.getByText("Password")).toBeDefined();

    const current_password = "P@ssw0rd1";
    const password = "P@ssw0rd2";

    await userEvent.type(
      screen.getByLabelText("Current Password"),
      current_password
    );

    await userEvent.type(screen.getByLabelText("New Password"), password);

    await userEvent.type(
      screen.getByLabelText("Repeat New Password"),
      password
    );

    fireEvent.click(screen.getByText("Update", { selector: "button" }));

    await waitFor(() => {
      expect(mockedFetchApi.mock.calls).toHaveLength(1);
    });

    expect(mockedFetchApi.mock.calls[0][3]).toEqual({
      current_password,
      password,
    });
  });
});
