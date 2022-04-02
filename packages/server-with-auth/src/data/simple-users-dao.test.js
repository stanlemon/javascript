import { Memory } from "lowdb";
import SimpleUsersDao from "./simple-users-dao.js";

describe("simple-users-dao", () => {
  // This is a user that we will reuse in our tests
  const data = {
    username: "test",
    password: "password",
  };
  // This will be our user database
  let users;

  beforeEach(() => {
    // Before each test reset our users database
    users = new SimpleUsersDao([], new Memory());
  });

  it("creates a user", async () => {
    let user = await users.createUser(data);

    expect(user.username).toEqual(data.username);
    // The value should be encrypted now
    expect(user.password).not.toEqual(data.password);
    // These fields are added by the create process
    expect(user.verification_token).not.toBeUndefined();
    expect(user.created_at).not.toBeUndefined();
    expect(user.last_updated).not.toBeUndefined();

    const refresh = users.getUserByUsername(data.username);

    // If we retrieve the user by username, it matches the object we got when we created it
    expect(refresh).toMatchObject(user);
  });

  it("creates a user with an existing username errors", async () => {
    let hasError = false;

    try {
      // Create the user
      await users.createUser(data);
      // Attempt to create the user again, this will fail
      await users.createUser(data);
    } catch (err) {
      hasError = err;
    }

    expect(hasError).not.toBe(false);
    expect(hasError.message).toEqual("This username is already taken.");
  });

  it("retrieve user by username and password", async () => {
    const user1 = await users.createUser(data);

    const user2 = users.getUserByUsernameAndPassword(
      data.username,
      data.password
    );

    expect(user1).toMatchObject(user2);
  });

  it("retrieve user by username and wrong password fails", async () => {
    await users.createUser(data);

    const user2 = users.getUserByUsernameAndPassword(
      data.username,
      "wrong password"
    );

    expect(user2).toBe(false);
  });

  it("retrieve user by username and undefined password fails", async () => {
    await users.createUser(data);

    const user2 = users.getUserByUsernameAndPassword(data.username, undefined);

    expect(user2).toBe(false);
  });

  it("retrieve user by username that does not exist fails", async () => {
    const user = users.getUserByUsernameAndPassword("notarealuser", "password");

    expect(user).toBe(false);
  });

  it("retrieve user by username that is undefined fails", async () => {
    const user = users.getUserByUsernameAndPassword(undefined, "password");

    expect(user).toBe(false);
  });
});
