import bcrypt from "bcryptjs";
import { LowSync, MemorySync } from "lowdb";
import { JSONFileSync } from "lowdb";
import { v4 as uuidv4 } from "uuid";

import UserDao from "./user-dao.js";

export function createInMemoryLowDb() {
  return new LowSync(new MemorySync(), {});
}

export function createJsonFileLowDb(filename = "./db.json") {
  return new LowSync(new JSONFileSync(filename), {});
}

/**
 * Create a database based on the environment.
 * Test environment (NODE_ENV=test) will use {MemorySync}.
 * @returns {LowSync} Database
 */
export function createLowDb() {
  return process.env.NODE_ENV === "test"
    ? createInMemoryLowDb()
    : createJsonFileLowDb();
}

export default class LowDBUserDao extends UserDao {
  #db;

  constructor(db = createLowDb()) {
    super();

    if (!(db instanceof LowSync)) {
      throw new Error("The db object must be of type LowSync.");
    }

    this.#db = db;
    this.#db.read();

    // Default data, ensure that users is an array if it is not already
    this.#db.data.users = db.data.users || [];
  }

  /** @inheritdoc */
  getUserById(userId) {
    return new Promise((resolve) => {
      resolve(
        this.#db.data.users
          .filter((user) => {
            // This one can get gross with numerical ids
            // eslint-disable-next-line eqeqeq
            return user.id == userId;
          })
          .shift()
      );
    });
  }

  /** @inheritdoc */
  getUserByUsername(username) {
    return new Promise((resolve) => {
      resolve(
        this.#db.data.users
          .filter((user) => {
            return user.username === username;
          })
          .shift()
      );
    });
  }

  /** @inheritdoc */
  getUserByUsernameAndPassword(username, password) {
    // Treat this like a failed login.
    if (!username || !password) {
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    return this.getUserByUsername(username).then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return false;
      }
      return user;
    });
  }

  /** @inheritdoc */
  getUserByVerificationToken(token) {
    return new Promise((resolve) => {
      resolve(
        this.#db.data.users
          .filter((user) => user.verification_token === token)
          .shift()
      );
    });
  }

  /** @inheritdoc */
  createUser(user) {
    return this.getUserByUsername(user.username).then((existing) => {
      if (existing) {
        throw new Error("This username is already taken.");
      }

      const now = new Date();

      const data = {
        ...user,
        password: bcrypt.hashSync(user.password, 10),
        id: uuidv4(),
        verification_token: uuidv4(),
        created_at: now,
        last_updated: now,
      };
      this.#db.data.users.push(data);
      this.#db.write();

      return data;
    });
  }

  /** @inheritdoc */
  updateUser(userId, user) {
    this.#db.data.users = this.#db.data.users.map((u) => {
      if (u.id === userId) {
        // If the password has been set, encrypt it
        if (user.password) {
          user.password = bcrypt.hashSync(user.password, 10);
        }

        return {
          ...u,
          ...user,
          id: userId,
          last_updated: new Date(),
          created_at: u.created_at, // Always preserve created_at
        };
      }
      return u;
    });
    this.#db.write();

    return new Promise((resolve) => {
      resolve(this.getUserById(userId));
    });
  }

  /** @inheritdoc */
  deleteUser(userId) {
    this.#db.data.users = this.#db.data.users.filter((u) => u.id !== userId);
    this.#db.write();
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  /** @inheritdoc */
  getAllUsers() {
    return new Promise((resolve) => {
      resolve(this.#db.data.users || []);
    });
  }

  /** @inheritdoc */
  close() {}
}
