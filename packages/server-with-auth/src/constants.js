export const HIDDEN_FIELDS = ["password", "verification_token"];

export const ROUTES = {
  SIGNUP: "/auth/signup",
  REGISTER: "/auth/register",
  SESSION: "/auth/session",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  USER: "/auth/user",
  VERIFY: "/auth/verify/:token",
  RESET: "/auth/reset",
  PASSWORD: "/auth/password",
};

/**
 * Authentication related events.
 *
 * Listen to these with the {EventEmitter}.
 */
export const EVENTS = {
  /**
   * When a user logs in.
   */
  USER_LOGIN: "user.login",
  /**
   * When a user logs out.
   */
  USER_LOGOUT: "user.logout",
  /**
   * When a user is created.
   */
  USER_CREATED: "user.created",
  /**
   * When a user is verified.
   */
  USER_VERIFIED: "user.verified",
  /**
   * When a user is updated.
   */
  USER_UPDATED: "user.updated",
  /**
   * When a user is deleted.
   */
  USER_DELETED: "user.deleted",
  /**
   * When a user changes their password.
   */
  USER_PASSWORD: "user.password",
  /**
   * When a user reset is requested.
   * This is not a managed lifecycle event, you'll need to implement this!
   */
  USER_RESET_REQUESTED: "user.reset.requested",
};
