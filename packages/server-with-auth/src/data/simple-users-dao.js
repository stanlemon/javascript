import { Low, JSONFile } from "lowdb";
import { v4 as uuidv4 } from "uuid";

export default class SimpleUsersDao {
  constructor(seeds = [], adapter = new JSONFile("./db.json")) {
    this.db = new Low(adapter);

    this.db.read().then(() => {
      this.db.data ||= { users: [] };

      if (seeds.length > 0) {
        seeds.forEach((user) => this.createUser(user));
      }
    });
  }

  getUserById = (userId) => {
    return this.db.data.users
      .filter((user) => {
        // This one can get gross with numerical ids
        // eslint-disable-next-line eqeqeq
        return user.id == userId;
      })
      .shift();
  };

  getUserByUsername = (username) => {
    return this.db.data.users
      .filter((user) => {
        return user.username === username;
      })
      .shift();
  };

  getUserByUsernameAndPassword = (username, password) => {
    return this.db.data.users
      .filter((user) => {
        return user.username === username && user.password === password;
      })
      .shift();
  };

  getUserByVerificationToken = (token) => {
    return this.db.data.users
      .filter((user) => user.verification_token === token)
      .shift();
  };

  createUser = async (user) => {
    const data = { ...user, id: uuidv4() };
    this.db.data.users.push(data);
    await this.db.write();
    return data;
  };

  updateUser = async (userId, user) => {
    this.db.data.users = this.db.data.users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          ...user,
          id: userId,
        };
      }
      return u;
    });
    await this.db.write();
    return this.getUserById(userId);
  };
}
