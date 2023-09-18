import UserDao from "../data/user-dao.js";

export default function checkUserDao(dao) {
  if (!(dao instanceof UserDao)) {
    throw new Error("The dao object must be of type UserDao.");
  }
}
