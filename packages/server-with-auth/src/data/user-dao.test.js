/**
 * @jest-environment node
 */
import LowDBUserDao, { createInMemoryLowDb } from "./lowdb-user-dao.js";
import KnexUserDao, { createBetterSqlite3Db } from "./knex-user-dao.js";

describe("user-dao", () => {
  createUserDaoTests("lowdb-user-dao", async () => {
    return new Promise((resolve) => {
      resolve(new LowDBUserDao(createInMemoryLowDb()));
    });
  });

  createUserDaoTests("knex-user-dao", async () => {
    return new KnexUserDao(await createBetterSqlite3Db());
  });
});

/**
 *
 * @param {String} name Name of the user dao implementation
 * @param {*} createDao A function to create a user dao implementation
 */
function createUserDaoTests(name, createDao) {
  describe(`${name}`, () => {
    // This is a user that we will reuse in our tests
    const data = {
      username: "test",
      password: "password",
    };

    /** @type {LowDBUserDao} */
    let dao;

    beforeEach(async () => {
      // Before each test reset our users database
      dao = await createDao();
    });

    afterEach(async () => {
      dao.close();
    });

    it("creates a user", async () => {
      let user = await dao.createUser(data);

      expect(user.username).toEqual(data.username);
      // The value should be encrypted now
      expect(user.password).not.toEqual(data.password);
      // These fields are added by the create process
      expect(user.verification_token).not.toBeUndefined();

      const refresh = await dao.getUserByUsername(data.username);

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

      const user2 = await dao.getUserByUsernameAndPassword(
        data.username,
        data.password
      );

      expect(user1).toMatchObject(user2);
    });

    it("retrieve user by username and wrong password fails", async () => {
      await dao.createUser(data);

      const user2 = await dao.getUserByUsernameAndPassword(
        data.username,
        "wrong password"
      );

      expect(user2).toBe(false);
    });

    it("retrieve user by username and undefined password fails", async () => {
      await dao.createUser(data);

      const user2 = await dao.getUserByUsernameAndPassword(
        data.username,
        undefined
      );

      expect(user2).toBe(false);
    });

    it("retrieve user by username that does not exist fails", async () => {
      const user = await dao.getUserByUsernameAndPassword(
        "notarealuser",
        "password"
      );

      expect(user).toBe(false);
    });

    it("retrieve user by username that is undefined fails", async () => {
      const user = await dao.getUserByUsernameAndPassword(
        undefined,
        "password"
      );

      expect(user).toBe(false);
    });

    it("updates a user", async () => {
      const user = await dao.createUser(data);

      expect(user.name).toBeFalsy();

      const name = "Test User";

      await dao.updateUser(user.id, { name: name });

      const reloaded = await dao.getUserById(user.id);

      expect(reloaded.name).toEqual(name);
    });

    it("deletes a user by id", async () => {
      const user = await dao.createUser(data);

      expect(await dao.getAllUsers()).toHaveLength(1);

      const deleted = await dao.deleteUser(user.id);

      expect(deleted).toBe(true);

      const reloaded = await dao.getUserById(user.id);

      expect(reloaded).toBeUndefined();

      expect(await dao.getAllUsers()).toHaveLength(0);
    });
  });
}
