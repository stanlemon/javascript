export default class UserDao {
  constructor() {}

  #error() {
    throw new Error(
      "The UserDao class serves as an interface, do not use it directly."
    );
  }

  /**
   * Get user by id.
   * @param {*} userId Identifier to get user by
   */
  // eslint-disable-next-line no-unused-vars
  getUserById(userId) {
    this.#error();
  }

  /**
   * Get user by username.
   * @param {string} username Username
   */
  // eslint-disable-next-line no-unused-vars
  getUserByUsername(username) {
    this.#error();
  }

  /**
   * Get user by username and password.
   * @param {string} username Username
   * @param {string} password Password
   */
  // eslint-disable-next-line no-unused-vars
  getUserByUsernameAndPassword(username, password) {
    this.#error();
  }

  /**
   * Get user by verification token.
   * @param {string} token User verification token
   */
  // eslint-disable-next-line no-unused-vars
  getUserByVerificationToken(token) {
    this.#error();
  }

  /**
   * Create a new user.
   * @param {object} user User
   */
  // eslint-disable-next-line no-unused-vars
  createUser(user) {
    this.#error();
  }

  /**
   * Update an existing user.
   * @param {*} userId User identifier
   * @param {object} user User object
   */
  // eslint-disable-next-line no-unused-vars
  updateUser(userId, user) {
    this.#error();
  }

  /**
   * Delete a user.
   * @param {*} userId User identifier
   */
  deleteUser(userId) {
    this.#error();
  }
}
