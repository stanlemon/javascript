import request from "supertest";
import { v4 as uuidv4 } from "uuid";

/**
 * Utility function to create a user and login for testing purposes.
 * @param {Express.Application} app express application server
 * @param {string} username username to sign up and login with
 * @param {string} password password to sign up and login with
 * @returns {Promise<{ id: string, token: string, username: string }>} user session information
 */
export async function signupAndLogin(
  app,
  username = "test" + uuidv4(),
  password = "p@$$w0rd!",
  extra = {}
) {
  const signup = await request(app)
    .post("/auth/signup")
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .send({
      username,
      password,
      ...extra,
    })
    .expect(200);

  const session = await request(app)
    .post("/auth/login")
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .send({
      username,
      password,
    })
    .expect(200);

  expect(signup.body.user.id).toEqual(session.body.user.id);

  return {
    id: session.body.user.id,
    token: session.body.token,
    username,
  };
}
