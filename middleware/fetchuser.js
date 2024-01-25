const jwt = require("jsonwebtoken");
const JWT_SECRET = "mediaBook-2.O";
const fetchuser = (req, res, next) => {
  //Get the user from jwt token and apend and add id to the req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  //next function is used to execute the next function
};
module.exports = fetchuser;