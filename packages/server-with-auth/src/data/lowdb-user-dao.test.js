/**
 * @jest-environment node
 */
import { MemorySync } from "lowdb";
import LowDBUserDao from "./lowdb-user-dao.js";

describe("lowdb-user-dao", () => {
  // This is a user that we will reuse in our tests
  const data = {
    username: "test",
    password: "password",
  };

  /** @type {LowDBUserDao} */
  let dao;

  beforeEach(() => {
    // Before each test reset our users database
    dao = new LowDBUserDao([], new MemorySync());
  });

  it("creates a user", async () => {
    let user = await dao.createUser(data);

    expect(user.username).toEqual(data.username);
    // The value should be encrypted now
    expect(user.password).not.toEqual(data.password);
    // These fields are added by the create process
    expect(user.verification_token).not.toBeUndefined();
    expect(user.created_at).not.toBeUndefined();
    expect(user.last_updated).not.toBeUndefined();

    const refresh = dao.getUserByUsername(data.username);

    // If we retrieve the user by username, it matches the object we got when we created it
    expect(refresh).toMatchObject(user);
  });

  it("creates a user with an existing username errors", async () => {
    let hasError = false;

    try {
      // Create the user
      await dao.createUser(data);
      // Attempt to create the user again, this will fail
      await dao.createUser(data);
    } catch (err) {
      hasError = err;
    }

    expect(hasError).not.toBe(false);
    expect(hasError.message).toEqual("This username is already taken.");
  });

  it("retrieve user by username and password", async () => {
    const user1 = await dao.createUser(data);

    const user2 = dao.getUserByUsernameAndPassword(
      data.username,
      data.password
    );

    expect(user1).toMatchObject(user2);
  });

  it("retrieve user by username and wrong password fails", async () => {
    await dao.createUser(data);

    const user2 = dao.getUserByUsernameAndPassword(
      data.username,
      "wrong password"
    );

    expect(user2).toBe(false);
  });

  it("retrieve user by username and undefined password fails", async () => {
    await dao.createUser(data);

    const user2 = dao.getUserByUsernameAndPassword(data.username, undefined);

    expect(user2).toBe(false);
  });

  it("retrieve user by username that does not exist fails", async () => {
    const user = dao.getUserByUsernameAndPassword("notarealuser", "password");

    expect(user).toBe(false);
  });

  it("retrieve user by username that is undefined fails", async () => {
    const user = dao.getUserByUsernameAndPassword(undefined, "password");

    expect(user).toBe(false);
  });

  it("deletes a user by id", async () => {
    const user = await dao.createUser(data);

    expect(dao.getDB().data.users).toHaveLength(1);

    const deleted = dao.deleteUser(user.id);

    expect(deleted).toBe(true);
    expect(dao.getUserById(user.id)).toBeUndefined();

    expect(dao.getDB().data.users).toHaveLength(0);
  });
});
