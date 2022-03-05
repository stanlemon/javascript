export default class UsersInMemory {
  constructor(user) {
    this.users = [];

    if (user) {
      this.users.push(user);
    }
  }

  getUserById = (userId) => {
    return this.users
      .filter((user) => {
        return user.id === userId;
      })
      .shift();
  };

  getUserByUsername = (username) => {
    return this.users
      .filter((user) => {
        return user.username === username;
      })
      .shift();
  };

  getUserByUsernameAndPassword = (username, password) => {
    return this.users
      .filter((user) => {
        return user.username === username && user.password === password;
      })
      .shift();
  };

  getUserByVerificationToken = (token) => {
    return this.users
      .filter((user) => user.verification_token === token)
      .shift();
  };

  createUser = (user) => {
    this.users.push(user);
    return user;
  };

  updateUser = (userId, user) => {
    this.users = this.users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          ...user,
          id: userId,
        };
      }
      return u;
    });
    return this.getUserById(userId);
  };
}
