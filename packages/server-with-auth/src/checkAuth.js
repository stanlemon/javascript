import passport from "passport";

export default function checkAuth() {
  return [
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res
          .status(401)
          .json({ error: "You must be logged in to access this resource." });
      }
    },
  ];
}
