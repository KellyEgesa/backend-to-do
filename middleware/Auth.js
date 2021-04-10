const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../secrets");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send({ message: "Access Denied, Provide a valid token" });

  try {
    const decoded = jwt.verify(token, jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
