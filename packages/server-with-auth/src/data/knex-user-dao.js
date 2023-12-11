import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import UserDao from "./user-dao.js";
import knex from "knex";

export async function createBetterSqlite3Db() {
  const db = knex({
    client: "better-sqlite3",
    connection: {
      filename: ":memory:",
    },
  });

  await db.schema.createTable("users", (table) => {
    table.string("id").primary(); // UUID
    table.string("username").notNullable();
    table.string("password").notNullable();
    table.string("email").nullable();
    table.string("name").nullable();
    table.string("verification_token").notNullable();
    table.boolean("active").defaultTo(true).notNullable();
    // TODO: Add dates
  });

  return db;
}

export default class KnexUserDao extends UserDao {
  #db;

  constructor(db) {
    super();

    // TODO: Check if db is a knex instance and throw an error if it is now
    this.#db = db;
  }

  /** @inheritdoc */
  async getUserById(userId) {
    return await this.#db("users")
      .select()
      .where({ id: userId, active: true })
      .first();
  }

  /** @inheritdoc */
  async getUserByUsername(username) {
    const user = await this.#db
      .select()
      .from("users")
      .where({ username: username, active: true })
      .first();

    return !user ? false : user;
  }

  /** @inheritdoc */
  async getUserByUsernameAndPassword(username, password) {
    // Treat this like a failed login.
    if (!username || !password) {
      return false;
    }

    const user = await this.getUserByUsername(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return false;
    }

    return user;
  }

  /** @inheritdoc */
  async getUserByVerificationToken(token) {
    if (!token) {
      return false;
    }

    const user = await this.#db("users")
      .select()
      .where({ verification_token: token, active: true })
      .first();

    return !user ? false : user;
  }

  /** @inheritdoc */
  async createUser(user) {
    const existing = await this.getUserByUsername(user.username);

    if (existing) {
      throw new Error("This username is already taken.");
    }

    const data = {
      ...user,
      password: bcrypt.hashSync(user.password, 10),
      id: uuidv4(),
      verification_token: uuidv4(),
      active: true,
    };

    await this.#db("users").insert(data);

    return await this.getUserById(data.id);
  }

  /** @inheritdoc */
  async updateUser(userId, user) {
    if (!userId) {
      throw new Error("User ID is required.");
    }
    if (!user) {
      throw new Error("User data is required");
    }

    const existing = await this.getUserById(userId);

    if (!existing) {
      throw new Error("User does not exist.");
    }

    await this.#db("users").where({ id: userId }).update(user);

    return await this.getUserById(userId);
  }

  /** @inheritdoc */
  async deleteUser(userId) {
    return !!(await this.#db("users").where({ id: userId }).delete());
  }

  async getAllUsers() {
    const users = await this.#db("users").select();
    return users;
  }

  close() {
    this.#db.destroy();
  }
}
