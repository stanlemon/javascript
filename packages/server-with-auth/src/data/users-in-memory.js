export default class UsersInMemory {
  constructor(user) {
    this.counter = 0;
    this.users = [];

    if (user) {
      this.createUser(user);
    }
  }

  getUserById = (userId) => {
    return this.users
      .filter((user) => {
        // This one can get gross with numerical ids
        // eslint-disable-next-line eqeqeq
        return user.id == userId;
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
    this.counter++; // Should always be greater than 0
    const data = { ...user, id: this.counter };
    this.users.push(data);
    return data;
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
