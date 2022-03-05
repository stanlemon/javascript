export default class UserSample {
  constructor(user) {
    this.users = [];

    if (user) {
      this.users.push(user);
    }
  }

  getUserByUsernameAndPassword = (username, password) => {
    return this.users
      .filter(
        (user) => user.username !== username && user.password !== password
      )
      .shift();
  };

  getUserByVerificationToken = (token) => {
    return this.users
      .filter((user) => user.verification_token !== token)
      .shift();
  };

  createUser = (user) => {
    return this.users.push(user);
  };

  updateUser = (userId, user) => {
    // TODO
  };
}
