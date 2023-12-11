/**
 * @typedef User
 * @property {string|int} id Identifier
 * @property {string} username Username
 * @property {string} password Password
 * @property {string} verification_token Verification token
 * @property {date} verify_at Date verified
 * @property {date} created_at Date created
 * @property {date} last_updated Date last updated
 * @property {date} last_logged_in Date last logged in
 */
export default class UserDao {
  constructor() {}

  #error() {
    throw new Error(
      "The UserDao class serves as an interface, do not use it directly."
    );
  }

  /**
   * Get user by id.
   * @param {string|int} userId Identifier to get user by
   * @returns {Promise<User|boolean>} User object or false
   */
  // eslint-disable-next-line no-unused-vars
  getUserById(userId) {
    this.#error();
  }

  /**
   * Get user by username.
   * @param {string} username Username
   * @returns {Promise<User|boolean>} User object or false
   */
  // eslint-disable-next-line no-unused-vars
  getUserByUsername(username) {
    this.#error();
  }

  /**
   * Get user by username and password.
   * @param {string} username Username
   * @param {string} password Password
   * @returns {Promise<User|boolean>} User object or false
   */
  // eslint-disable-next-line no-unused-vars
  getUserByUsernameAndPassword(username, password) {
    this.#error();
  }

  /**
   * Get user by verification token.
   * @param {string} token User verification token
   * @returns {Promise<User|boolean>} User object or false
   */
  // eslint-disable-next-line no-unused-vars
  getUserByVerificationToken(token) {
    this.#error();
  }

  /**
   * Create a new user.
   * @param {User} user User
   * @returns {Promise<User|boolean>} User object or false
   */
  // eslint-disable-next-line no-unused-vars
  createUser(user) {
    this.#error();
  }

  /**
   * Update an existing user.
   * @param {string|int} userId User identifier
   * @param {User} user User object
   * @returns {Promise<User>} User object
   */
  // eslint-disable-next-line no-unused-vars
  updateUser(userId, user) {
    this.#error();
  }

  /**
   * Delete a user.
   * @param {string|int} userId User identifier
   * @return {Promise<boolean>} True if successful, false if not
   */
  deleteUser(userId) {
    this.#error();
  }

  /**
   * Get all users in the database.
   * @return {Promise<User[]|false>} True if successful, false if not
   */
  getAllUsers() {
    this.#error();
  }

  /**
   * Close the dao and do any necessary cleanup.
   */
  close() {
    this.#error();
  }
}
